import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const REASON_LABELS: Record<string, string> = {
  harcelement: 'Harcèlement',
  contenu_inapproprie: 'Contenu inapproprié',
  spam: 'Spam',
  usurpation_identite: "Usurpation d'identité",
  autre: 'Autre',
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reportedUserId, reason, details } = body as {
      reportedUserId: string
      reason: string
      details?: string
    }

    if (!reportedUserId || !reason) {
      return NextResponse.json({ error: 'Missing reportedUserId or reason.' }, { status: 400 })
    }

    // Verify the caller is authenticated — the reporter's identity is looked
    // up from THEIR OWN session below, never trusted from the request body.
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
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

    const reasonLabel = REASON_LABELS[reason] ?? reason

    // ── Email content ────────────────────────────────────────────────────────
    const subject = `🚩 Signalement Beez — ${reasonLabel}`

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0d3459;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d3459;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0a2540;border:1px solid rgba(255,255,255,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="font-size:24px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;">Bee</span><span style="font-size:24px;font-weight:800;letter-spacing:-0.5px;color:#ebaf57;">z</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">
                Nouveau signalement&nbsp;🚩
              </p>
              <p style="margin:0 0 8px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                <strong style="color:#ebaf57;">${escapeHtml(reporterName)}</strong> (${user.id}) a signalé l'utilisateur <strong style="color:#ebaf57;">${escapeHtml(reportedUserId)}</strong>.
              </p>
              <p style="margin:0 0 8px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                <strong style="color:#ffffff;">Motif :</strong> ${reasonLabel}
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
