'use client'

import { motion, useScroll } from 'motion/react'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: '#ebaf57',
        transformOrigin: 'left',
        zIndex: 1000,
      }}
    />
  )
}
