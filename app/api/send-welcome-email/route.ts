import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { escapeHtml, stripLineBreaks } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)

// Rien n'est lu dans la requête : l'adresse vient de la session, le prénom et
// le numéro de membre viennent de la base.
export async function POST() {
  try {
    // Verify the caller is authenticated
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const admin = createAdminClient()
    if (!process.env.RESEND_API_KEY || !admin) {
      console.warn('[send-welcome-email] RESEND_API_KEY or Supabase secret key not set — skipping email.')
      return NextResponse.json({ ok: true, skipped: true })
    }

    if (!user.email) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    // ── Un seul envoi par membre ─────────────────────────────────────────────
    // welcome_email_sent_at n'est posé que s'il est vide, en une seule requête :
    // deux appels simultanés (double clic, rechargement) ne peuvent pas passer
    // tous les deux. Si Resend refuse l'envoi, la date est retirée plus bas :
    // elle ne reste en place que si l'email est bien parti.
    const sentAt = new Date().toISOString()
    const { data: profile, error: claimError } = await admin
      .from('profiles')
      .update({ welcome_email_sent_at: sentAt })
      .eq('user_id', user.id)
      .is('welcome_email_sent_at', null)
      .select('first_name, member_number')
      .maybeSingle()

    if (claimError) {
      console.error('[send-welcome-email] Could not reserve the send:', claimError)
      return NextResponse.json({ ok: true, warning: 'Email not sent.' })
    }
    if (!profile) {
      // Pas encore de profil, ou email de bienvenue déjà envoyé.
      return NextResponse.json({ ok: true, skipped: true })
    }

    const firstName: string = profile.first_name
    const memberNumber: number | null = profile.member_number

    // ── Email content ────────────────────────────────────────────────────────
    const isFoundingMember = memberNumber != null && memberNumber <= 150
    const paddedNumber = memberNumber != null ? String(memberNumber).padStart(3, '0') : null

    const subject = isFoundingMember
      ? `🐝 Bienvenue Founding Member #${paddedNumber} !`
      : `Bienvenue dans la ruche, ${stripLineBreaks(firstName)} 🐝`

    const memberBadgeHtml = isFoundingMember
      ? // Badge Founding Member : seul élément de l'email qui reste en or.
        `<div style="display:inline-block;margin:0 0 24px;padding:8px 16px;background:rgba(235,175,87,0.12);border:1px solid rgba(235,175,87,0.4);border-radius:6px;">
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
                Bienvenue dans la ruche, ${escapeHtml(firstName)}&nbsp;✦
              </p>
              ${memberBadgeHtml}
              ${isFoundingMember ? `
              <p style="margin:24px 0;padding:20px;background:rgba(87,217,235,0.1);border-left:3px solid #57d9eb;border-radius:8px;font-size:15px;color:#cccccc;line-height:1.7;">
                🎉 <strong style="color:#57d9eb;">Félicitations !</strong> Tu fais partie des 150 premiers membres fondateurs de Beez et ton badge porte le numéro <strong style="color:#57d9eb;">#${paddedNumber}</strong>.<br/><br/>
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
                <a href="mailto:contact@joinbeez.com" style="color:#57d9eb;text-decoration:none;">contact@joinbeez.com</a>
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
    const { error: sendError } = await resend.emails.send(
      {
        from: 'Beez <onboarding@joinbeez.com>',
        to: [user.email],
        subject,
        html,
        text,
      },
      // Second filet côté Resend : une même clé n'envoie jamais deux emails.
      { idempotencyKey: `welcome-email/${user.id}` }
    )

    if (sendError) {
      console.error('[send-welcome-email] Resend error:', sendError)
      // Retire la date posée plus haut : un nouvel essai reste possible.
      await admin
        .from('profiles')
        .update({ welcome_email_sent_at: null })
        .eq('user_id', user.id)
        .eq('welcome_email_sent_at', sentAt)
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
