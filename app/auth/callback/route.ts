import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/onboarding'
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? requestUrl.origin

  if (!code) {
    // Missing code — redirect to signup with error
    return NextResponse.redirect(
      `${origin}/onboarding?error=missing_code`
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchange error:', error.message)
    return NextResponse.redirect(
      `${origin}/onboarding?error=auth_failed`
    )
  }

  // Successful auth — redirect to onboarding (or custom `next` param if safe)
  const safeNext =
    next.startsWith('/') && !next.startsWith('//') ? next : '/onboarding'

  return NextResponse.redirect(`${origin}${safeNext}`)
}
