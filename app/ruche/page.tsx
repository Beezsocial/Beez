import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavHeader from '@/components/ui/NavHeader'
import RucheClient from './RucheClient'

export default async function RuchePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    redirect('/signin')
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#ffffff' }}>
      <NavHeader />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden pt-14">
        <RucheClient />
      </div>
    </div>
  )
}
