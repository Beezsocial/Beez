import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { receiverId } = body as { receiverId: string }

    if (!receiverId) {
      return NextResponse.json({ error: 'Missing receiverId.' }, { status: 400 })
    }

    // Verify the caller is authenticated — the sender's name is looked up
    // from THEIR OWN session below, never trusted from the request body.
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    if (!process.env.RESEND_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('[notify-message] RESEND_API_KEY or SUPABASE_SERVICE_ROLE_KEY not set — skipping email.')
      return NextResponse.json({ ok: true, skipped: true })
    }

    // ── Sender's display name ───────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data: senderProfile } = await db
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .single()

    const senderName = senderProfile
      ? `${senderProfile.first_name} ${senderProfile.last_name}`
      : 'Un membre de la ruche'

    // ── Receiver's email — auth.users isn't exposed to the anon/authenticated
    // roles, so this needs the service role (admin) client. ──────────────────
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: receiverAuth, error: receiverError } = await admin.auth.admin.getUserById(receiverId)

    if (receiverError || !receiverAuth.user?.email) {
      console.warn('[notify-message] Could not resolve receiver email:', receiverError)
      return NextResponse.json({ ok: true, warning: 'Receiver email not found.' })
    }

    // ── Email content ────────────────────────────────────────────────────────
    const subject = '🐝 Tu as reçu un message sur Beez'
    const messagesUrl = 'https://www.joinbeez.com/messages'

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
                Nouveau message&nbsp;✦
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                <strong style="color:#ebaf57;">${senderName}</strong> t'a envoyé un message sur Beez.
              </p>
              <a href="${messagesUrl}" style="display:inline-block;padding:14px 28px;background:#ebaf57;color:#082b44;font-weight:700;font-size:15px;text-decoration:none;border-radius:10px;">
                Va y répondre →
              </a>
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

    const text = `${senderName} t'a envoyé un message sur Beez.\n\nVa y répondre : ${messagesUrl}`

    // ── Send ─────────────────────────────────────────────────────────────────
    const { error: sendError } = await resend.emails.send({
      from: 'Beez <onboarding@joinbeez.com>',
      to: [receiverAuth.user.email],
      subject,
      html,
      text,
    })

    if (sendError) {
      console.error('[notify-message] Resend error:', sendError)
      return NextResponse.json({ ok: true, warning: sendError.message })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[notify-message] Unexpected error:', err)
    // Never let a notification failure surface as a message-send error
    return NextResponse.json({ ok: true, warning: 'Email delivery failed.' })
  }
}
