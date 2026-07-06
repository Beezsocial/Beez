'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from 'motion/react'
import { createClient } from '@/lib/supabase/client'

export default function MemberCounter() {
  const [count, setCount] = useState<number | null>(null)
  const [displayCount, setDisplayCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function animateCount(from: number, to: number, duration = 1200) {
    const steps = 48
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
      const { count: c, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      console.log('[MemberCounter] fetched count:', c, error)

      if (typeof c === 'number') {
        setCount(c)
      }
    }

    fetchCount()
    const interval = setInterval(fetchCount, 30_000)

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

  // Trigger count-up from 0 when both in-view AND count loaded
  useEffect(() => {
    if (isInView && count != null && !hasAnimated) {
      setHasAnimated(true)
      animateCount(0, count, count === 0 ? 0 : 1200)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, count])

  // Re-animate on live updates after initial animation
  useEffect(() => {
    if (!hasAnimated || count == null) return
    animateCount(displayCount, count, 600)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  useEffect(() => {
    return () => {
      if (animationRef.current) clearInterval(animationRef.current)
    }
  }, [])

  // The div below must always render — useInView attaches its
  // IntersectionObserver to `ref` on mount, so if this returned null while
  // count was still loading, there was nothing to observe and isInView
  // would never flip true, leaving the count-up animation stuck at 0.
  return (
    <div ref={ref} className="text-center mt-6" style={{ opacity: count == null ? 0 : 1, transition: 'opacity 0.3s' }}>
      <p
        style={{
          fontFamily: 'Outfit, sans-serif',
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
