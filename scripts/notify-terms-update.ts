// ─────────────────────────────────────────────────────────────────────────────
// Beez — One-off script: notify existing members of updated Terms/Privacy
//
// This is a LOCAL ADMIN TOOL, not a deployed route. It lives outside app/,
// so Next.js never bundles or exposes it — it only runs when invoked
// directly from a terminal with the Supabase service role key.
//
// Usage:
//   npx tsx scripts/notify-terms-update.ts --dry-run   (test first — no emails sent)
//   npx tsx scripts/notify-terms-update.ts             (actually sends)
//
// Requires SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL and
// RESEND_API_KEY in .env.local.
// ─────────────────────────────────────────────────────────────────────────────

import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Next.js convention is .env.local (not .env), so point dotenv there explicitly.
loadEnv({ path: '.env.local' })

const DRY_RUN = process.argv.includes('--dry-run')
const SEND_DELAY_MS = 500

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing required env var: ${name} (check .env.local)`)
    process.exit(1)
  }
  return value
}

const SUPABASE_URL = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
const SERVICE_ROLE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
// In --dry-run, resend.emails.send() is never called, so a real key isn't
// needed — but the SDK's constructor throws on a falsy key regardless, so a
// placeholder keeps dry-run usable without RESEND_API_KEY configured yet.
const RESEND_API_KEY = DRY_RUN ? process.env.RESEND_API_KEY ?? 'dry-run-placeholder' : requireEnv('RESEND_API_KEY')

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const resend = new Resend(RESEND_API_KEY)

type Recipient = {
  userId: string
  email: string
  firstName: string | null
}

async function fetchAllUsers(): Promise<{ id: string; email: string }[]> {
  const users: { id: string; email: string }[] = []
  let page = 1
  const perPage = 200

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) {
      console.error('Failed to list users:', error.message)
      process.exit(1)
    }
    for (const u of data.users) {
      if (u.email) users.push({ id: u.id, email: u.email })
    }
    if (data.users.length < perPage) break
    page++
  }

  return users
}

async function fetchFirstNames(): Promise<Map<string, string>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = admin as any
  const { data, error } = await db.from('profiles').select('user_id, first_name')
  if (error) {
    console.error('Failed to fetch profiles:', error.message)
    process.exit(1)
  }
  const map = new Map<string, string>()
  for (const row of data ?? []) {
    if (row.first_name) map.set(row.user_id, row.first_name)
  }
  return map
}

function buildEmail(firstName: string | null) {
  const greeting = firstName ? `Bonjour ${firstName},` : 'Bonjour,'
  const subject = '🐝 Mise à jour de nos conditions d\'utilisation'

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
              <p style="margin:0 0 20px;font-size:20px;font-weight:700;color:#ffffff;line-height:1.4;">
                ${greeting}
              </p>
              <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                Nous avons mis à jour nos Conditions d'Utilisation et notre Politique de Confidentialité, notamment pour encadrer notre nouvelle fonctionnalité de messagerie entre membres.
              </p>
              <p style="margin:0 0 8px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                Tu peux consulter les nouvelles versions ici :
              </p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.8;">
                <a href="https://www.joinbeez.com/terms" style="color:#ebaf57;text-decoration:none;">Conditions d'utilisation →</a><br/>
                <a href="https://www.joinbeez.com/privacy" style="color:#ebaf57;text-decoration:none;">Politique de confidentialité →</a>
              </p>
              <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                En continuant à utiliser Beez, tu acceptes ces mises à jour.
              </p>
              <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.6);line-height:1.6;">
                Pour toute question : <a href="mailto:contact@joinbeez.com" style="color:#ebaf57;text-decoration:none;">contact@joinbeez.com</a>
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

  const text = `${greeting}

Nous avons mis à jour nos Conditions d'Utilisation et notre Politique de Confidentialité, notamment pour encadrer notre nouvelle fonctionnalité de messagerie entre membres.

Tu peux consulter les nouvelles versions ici :
- Conditions d'utilisation : https://www.joinbeez.com/terms
- Politique de confidentialité : https://www.joinbeez.com/privacy

En continuant à utiliser Beez, tu acceptes ces mises à jour.

Pour toute question : contact@joinbeez.com

L'équipe Beez 🐝`

  return { subject, html, text }
}

async function main() {
  console.log(DRY_RUN ? '── DRY RUN — no emails will be sent ──' : '── LIVE RUN — emails will be sent via Resend ──')

  const [users, firstNames] = await Promise.all([fetchAllUsers(), fetchFirstNames()])
  const recipients: Recipient[] = users.map((u) => ({
    userId: u.id,
    email: u.email,
    firstName: firstNames.get(u.id) ?? null,
  }))

  console.log(`Found ${recipients.length} member(s) to notify.\n`)

  let sent = 0
  let failed = 0

  for (const recipient of recipients) {
    const { subject, html, text } = buildEmail(recipient.firstName)

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would send to ${recipient.email} (${recipient.firstName ?? 'no profile name'})`)
      continue
    }

    const { error } = await resend.emails.send({
      from: 'Beez <onboarding@joinbeez.com>',
      to: [recipient.email],
      subject,
      html,
      text,
    })

    if (error) {
      console.error(`✗ Failed to send to ${recipient.email}: ${error.message}`)
      failed++
    } else {
      console.log(`✓ Sent to ${recipient.email}`)
      sent++
    }

    await sleep(SEND_DELAY_MS)
  }

  if (!DRY_RUN) {
    console.log(`\nDone. ${sent} sent, ${failed} failed.`)
  } else {
    console.log(`\nDry run complete. ${recipients.length} email(s) would have been sent.`)
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
