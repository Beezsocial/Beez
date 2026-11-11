import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { escapeHtml, stripLineBreaks } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)

const REASON_LABELS: Record<string, string> = {
  harcelement: 'Harcèlement',
  contenu_inapproprie: 'Contenu inapproprié',
  spam: 'Spam',
  usurpation_identite: "Usurpation d'identité",
  autre: 'Autre',
}

export async function POST(request: Request) {
  try {
    // Verify the caller is authenticated — the reporter's identity is looked
    // up from THEIR OWN session below, never trusted from the request body.
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const reportedUserId = body?.reportedUserId
    const reason = body?.reason
    const details = typeof body?.details === 'string' ? body.details : ''

    if (typeof reportedUserId !== 'string' || !reportedUserId || typeof reason !== 'string' || !reason) {
      return NextResponse.json({ error: 'Missing reportedUserId or reason.' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn('[notify-report] RESEND_API_KEY not set — skipping email.')
      return NextResponse.json({ ok: true, skipped: true })
    }

    // ── Reporter's display name ─────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data: reporterProfile } = await db
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .single()

    const reporterName = reporterProfile
      ? `${reporterProfile.first_name} ${reporterProfile.last_name}`
      : 'Un membre de la ruche'

    // Hors liste, le motif est le texte brut envoyé par le membre.
    const reasonLabel = REASON_LABELS[reason] ?? reason

    // ── Email content ────────────────────────────────────────────────────────
    const subject = `🚩 Signalement Beez — ${stripLineBreaks(reasonLabel)}`

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#041625;font-family:Outfit,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#041625;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#082b44;border:1px solid rgba(255,255,255,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="font-size:24px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;">Bee</span><span style="font-size:24px;font-weight:800;letter-spacing:-0.5px;color:#57d9eb;">z</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">
                Nouveau signalement&nbsp;🚩
              </p>
              <p style="margin:0 0 8px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                <strong style="color:#57d9eb;">${escapeHtml(reporterName)}</strong> (${user.id}) a signalé l'utilisateur <strong style="color:#57d9eb;">${escapeHtml(reportedUserId)}</strong>.
              </p>
              <p style="margin:0 0 8px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                <strong style="color:#ffffff;">Motif :</strong> ${escapeHtml(reasonLabel)}
              </p>
              ${details ? `<p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;"><strong style="color:#ffffff;">Détails :</strong> ${escapeHtml(details)}</p>` : ''}
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;">
                Consulte la table <code>reports</code> dans Supabase pour le détail complet du signalement.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.3);line-height:1.5;">
                L'équipe Beez 🐝
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

    const text = `${reporterName} (${user.id}) a signalé l'utilisateur ${reportedUserId}.\nMotif : ${reasonLabel}${details ? `\nDétails : ${details}` : ''}`

    // ── Send ─────────────────────────────────────────────────────────────────
    const { error: sendError } = await resend.emails.send({
      from: 'Beez <onboarding@joinbeez.com>',
      to: ['contact@joinbeez.com'],
      subject,
      html,
      text,
    })

    if (sendError) {
      console.error('[notify-report] Resend error:', sendError)
      return NextResponse.json({ ok: true, warning: sendError.message })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[notify-report] Unexpected error:', err)
    // Never let a notification failure surface as a report-submit error
    return NextResponse.json({ ok: true, warning: 'Email delivery failed.' })
  }
}
