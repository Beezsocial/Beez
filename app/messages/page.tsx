import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NavHeader from '@/components/ui/NavHeader'
import MessagesClient from './MessagesClient'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    redirect('/signin')
  }

  return (
    <div className="h-screen bg-navy honeycomb-bg flex flex-col overflow-hidden">
      <NavHeader />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden pt-14">
        <MessagesClient currentUserId={data.user.id} />
      </div>
    </div>
  )
}
