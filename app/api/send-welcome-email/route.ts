import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, firstName, memberNumber } = body as {
      email: string
      firstName: string
      memberNumber: number | null
    }

    if (!email || !firstName) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    // Verify the caller is authenticated
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn('[send-welcome-email] RESEND_API_KEY is not set — skipping email.')
      return NextResponse.json({ ok: true, skipped: true })
    }

    // ── Email content ────────────────────────────────────────────────────────
    const isFoundingMember = memberNumber != null && memberNumber <= 150
    const paddedNumber = memberNumber != null ? String(memberNumber).padStart(3, '0') : null

    const subject = isFoundingMember
      ? `🐝 Bienvenue Founding Member #${paddedNumber} !`
      : `Bienvenue dans la ruche, ${firstName} 🐝`

    const memberBadgeHtml = isFoundingMember
      ? `<div style="display:inline-block;margin:0 0 24px;padding:8px 16px;background:rgba(235,175,87,0.12);border:1px solid rgba(235,175,87,0.4);border-radius:6px;">
          <span style="color:#ebaf57;font-weight:700;font-size:14px;">✦ Founding Member #${paddedNumber}</span>
        </div>`
      : memberNumber != null
        ? `<div style="display:inline-block;margin:0 0 24px;padding:6px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:6px;">
            <span style="color:rgba(255,255,255,0.5);font-size:13px;">Membre #${paddedNumber}</span>
          </div>`
        : ''

    const memberBodyText = isFoundingMember
      ? `Tu fais partie des 150 premiers membres de Beez. Tu as l'accès Pro gratuit à vie. Ton badge : ✦ Founding Member #${paddedNumber}`
      : 'Bienvenue dans la ruche !'

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
                Bienvenue dans la ruche, ${firstName}&nbsp;✦
              </p>
              ${memberBadgeHtml}
              ${isFoundingMember ? `
              <p style="margin:24px 0;padding:20px;background:rgba(235,175,87,0.1);border-left:3px solid #ebaf57;border-radius:8px;font-size:15px;color:#cccccc;line-height:1.7;">
                🎉 <strong style="color:#ebaf57;">Félicitations !</strong> Tu fais partie des 150 premiers membres fondateurs de Beez et ton badge porte le numéro <strong style="color:#ebaf57;">#${paddedNumber}</strong>.<br/><br/>
                Beez Pro sera <strong style="color:#ffffff;">gratuit à vie</strong> pour toi !<br/>
                Merci de ta confiance. 🐝
              </p>
              ` : `<p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">${memberBodyText}</p>`}
              <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                L'app arrive bientôt. Tu seras notifié en premier dès que les portes s'ouvrent.
              </p>
              <p style="margin:0 0 8px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                En attendant, tu peux consulter ton profil de membre et partager ton appartenance à la ruche.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.3);line-height:1.5;">
                L'équipe Beez 🐝<br />
                <a href="mailto:contact@joinbeez.com" style="color:#ebaf57;text-decoration:none;">contact@joinbeez.com</a>
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

    const text = isFoundingMember
      ? `Bienvenue dans la ruche, ${firstName} ✦\n\n🎉 Félicitations ! Tu fais partie des 150 premiers membres fondateurs de Beez et ton badge porte le numéro #${paddedNumber}.\nBeez Pro sera gratuit à vie pour toi !\nMerci de ta confiance. 🐝\n\nL'app arrive bientôt. Tu seras notifié en premier dès que les portes s'ouvrent.\n\n— L'équipe Beez`
      : `Bienvenue dans la ruche, ${firstName} ✦\n\nBienvenue dans la ruche !\n\nL'app arrive bientôt. Tu seras notifié en premier dès que les portes s'ouvrent.\n\n— L'équipe Beez`

    // ── Send ─────────────────────────────────────────────────────────────────
    const { error: sendError } = await resend.emails.send({
      from: 'Beez <onboarding@joinbeez.com>',
      to: [email],
      subject,
      html,
      text,
    })

    if (sendError) {
      console.error('[send-welcome-email] Resend error:', sendError)
      // Non-fatal — registration already succeeded
      return NextResponse.json({ ok: true, warning: sendError.message })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[send-welcome-email] Unexpected error:', err)
    // Never let an email failure surface to the client as a registration error
    return NextResponse.json({ ok: true, warning: 'Email delivery failed.' })
  }
}
