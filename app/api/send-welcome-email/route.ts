import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Verify the caller is authenticated — belt-and-suspenders check
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    // Build email content
    const memberLine =
      memberNumber != null
        ? `Tu es le membre fondateur #${memberNumber} de Beez. 🐝`
        : "Tu fais partie des premiers membres de Beez."

    const subject = `Bienvenue dans la ruche, ${firstName} 🐝`

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
              <span style="font-size:24px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;">B</span><span style="font-size:24px;font-weight:800;letter-spacing:-0.5px;color:#ebaf57;">eez</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">
                Bienvenue dans la ruche, ${firstName}&nbsp;✦
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                ${memberLine}
              </p>
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

    const text = `Bienvenue dans la ruche, ${firstName} ✦\n\n${memberLine}\n\nL'app arrive bientôt. Tu seras notifié en premier dès que les portes s'ouvrent.\n\n— L'équipe Beez`

    // Send via Supabase admin auth email (uses your configured SMTP)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!serviceRoleKey || !supabaseUrl) {
      // Log and skip — don't fail the registration flow
      console.error('[send-welcome-email] Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL')
      return NextResponse.json({ ok: true, skipped: true })
    }

    // Use Supabase admin API to send a custom email
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${user.id}`, {
      method: 'GET',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    })

    if (!res.ok) {
      console.error('[send-welcome-email] Could not verify user via admin API')
    }

    // Supabase does not expose a generic "send email" endpoint from admin API.
    // Use your transactional email provider here (Resend, SendGrid, Postmark, etc.)
    // Example with Resend:
    //
    // const resendKey = process.env.RESEND_API_KEY
    // if (resendKey) {
    //   await fetch('https://api.resend.com/emails', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${resendKey}`,
    //     },
    //     body: JSON.stringify({
    //       from: 'Beez <noreply@joinbeez.com>',
    //       to: [email],
    //       subject,
    //       html,
    //       text,
    //     }),
    //   })
    // }

    // For now, log that we would have sent the email
    console.log(`[send-welcome-email] Would send welcome email to ${email} — integrate your email provider above.`)
    console.log(`[send-welcome-email] Subject: ${subject}`)
    void html
    void text

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[send-welcome-email] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
