'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MemberCounter() {
  const [count, setCount] = useState<number | null>(null)
  const [displayCount, setDisplayCount] = useState(0)
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function animateCount(from: number, to: number, duration = 1000) {
    const steps = 40
    const stepMs = duration / steps
    const increment = (to - from) / steps
    let current = from
    let step = 0

    if (animationRef.current) clearInterval(animationRef.current)
    animationRef.current = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        setDisplayCount(to)
        if (animationRef.current) clearInterval(animationRef.current)
      } else {
        setDisplayCount(Math.round(current))
      }
    }, stepMs)
  }

  useEffect(() => {
    const supabase = createClient()

    async function fetchCount() {
      // Uses the anon key — works for both authenticated and unauthenticated users
      const { count: c } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      if (typeof c === 'number') {
        setCount(c)
      }
    }

    fetchCount()

    // Refresh every 30s
    const interval = setInterval(fetchCount, 30_000)

    // Realtime: increment on new INSERT
    const channel = supabase
      .channel('member-counter')
      .on(
        'postgres_changes' as any,
        { event: 'INSERT', schema: 'public', table: 'profiles' },
        () => {
          setCount((prev) => (prev != null ? prev + 1 : prev))
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  // Animate whenever count changes
  useEffect(() => {
    if (count == null) return
    animateCount(displayCount, count, count === 0 ? 0 : 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) clearInterval(animationRef.current)
    }
  }, [])

  if (count == null) return null

  return (
    <div className="text-center mt-6">
      <p
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(48px, 8vw, 72px)',
          fontWeight: 800,
          color: '#ebaf57',
          lineHeight: 1,
          textShadow: '0 0 20px rgba(235,175,87,0.4)',
          margin: 0,
        }}
      >
        {displayCount}
      </p>
      <p
        className="uppercase tracking-wider text-sm mt-2"
        style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em' }}
      >
        membres dans la ruche
      </p>
    </div>
  )
}
