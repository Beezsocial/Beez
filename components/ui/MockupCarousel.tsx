'use client'

import { useState, useEffect, useRef } from 'react'
import React from 'react'
import Image from 'next/image'

// ─── Tokens ───────────────────────────────────────────────────────────────────
const B = {
  // Fond des maquettes officielles (bande vide de 47 px en haut de chaque écran)
  screen: '#041625',
  white: '#ffffff',
  accent: '#57d9eb',
  font: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
}

// ─── Screens ──────────────────────────────────────────────────────────────────
// Maquettes officielles : écrans 390 × 844 exportés en 2x (780 × 1688). Le haut
// de chaque écran laisse 47 px vides, occupés par la StatusBar du cadre.
const SCREENS = [
  { src: '/images/mockups/fil.webp',    alt: 'Le Fil Beez',                            label: 'Fil' },
  { src: '/images/mockups/matchs.webp', alt: "Tes matchs proposés par l'IA",           label: 'Matchs' },
  { src: '/images/mockups/boite.webp',  alt: 'La Boîte, la page de ton entreprise',    label: 'La Boîte' },
  { src: '/images/mockups/help.webp',   alt: 'Help !, demande de conseils à la ruche', label: 'Help !' },
  { src: '/images/mockups/ruche.webp',  alt: 'La Ruche des membres',                   label: 'Ruche' },
  { src: '/images/mockups/profil.webp', alt: 'Ton profil Beez',                        label: 'Profil' },
]

// ─── Shell ────────────────────────────────────────────────────────────────────
function StatusBar({ time = '9:41' }: { time?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px 6px', color: B.white, fontSize: 15, fontWeight: 600, position: 'relative', zIndex: 10 }}>
      <span style={{ letterSpacing: '-0.2px' }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="17" height="11" viewBox="0 0 17 11">
          <rect x="0" y="7" width="3" height="4" rx="0.5" fill={B.white}/><rect x="4.5" y="5" width="3" height="6" rx="0.5" fill={B.white}/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill={B.white}/><rect x="13.5" y="0" width="3" height="11" rx="0.5" fill={B.white}/>
        </svg>
        <svg width="25" height="11" viewBox="0 0 25 11">
          <rect x="0.5" y="0.5" width="21" height="10" rx="3" stroke={B.white} strokeOpacity="0.45" fill="none"/>
          <rect x="2" y="2" width="17" height="7" rx="1.5" fill={B.white}/>
          <path d="M23 4v3c.7-.2 1.2-.9 1.2-1.5S23.7 4.2 23 4z" fill={B.white} fillOpacity="0.5"/>
        </svg>
      </div>
    </div>
  )
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────
function BeezPhone({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position:'relative', width:408, height:862, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:62 }}>
      <div style={{ position:'absolute', inset:-28, borderRadius:90, background:'radial-gradient(60% 50% at 50% 50%,rgba(87,217,235,0.32) 0%,rgba(87,217,235,0.12) 40%,transparent 75%)', filter:'blur(18px)', pointerEvents:'none' }} />
      <div style={{ position:'relative', width:390, height:844, borderRadius:54, background:'#000', padding:9, boxShadow:'0 0 0 2px rgba(87,217,235,0.4),0 0 30px rgba(87,217,235,0.35),0 0 60px rgba(87,217,235,0.18),0 40px 80px rgba(0,0,0,0.4)' }}>
        {/* Écran : rayon 45 = rayon du cadre (54) − son épaisseur (9), concentrique */}
        <div style={{ width:'100%', height:'100%', borderRadius:45, overflow:'hidden', background:B.screen, position:'relative', fontFamily:B.font, color:B.white, fontSize:16 }}>
          <div style={{ position:'absolute', top:10, left:'50%', transform:'translateX(-50%)', width:120, height:34, borderRadius:20, background:'#000', zIndex:40 }} />
          <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:30 }}>
            <StatusBar />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Carousel ─────────────────────────────────────────────────────────────────
const SCALE   = 0.72
const DW      = Math.round(408 * SCALE)  // 294
const DH      = Math.round(862 * SCALE)  // 621
// Largeur affichée de l'image : un écran 390 × 844 posé en object-fit cover
// dans l'écran du cadre (372 × 826) fait ≈ 382 px de large, réduit par SCALE.
const IMAGE_SIZES = `${Math.ceil(382 * SCALE)}px`

export default function MockupCarousel() {
  const [index, setIndex]   = useState(0)
  const [visible, setVisible] = useState(true)
  const indexRef  = useRef(0)
  const startXRef = useRef<number | null>(null)

  function goTo(n: number) {
    const i = ((n % SCREENS.length) + SCREENS.length) % SCREENS.length
    setVisible(false)
    setTimeout(() => { setIndex(i); indexRef.current = i; setVisible(true) }, 300)
  }

  useEffect(() => {
    const id = setInterval(() => goTo(indexRef.current + 1), 8000)
    return () => clearInterval(id)
  }, [])

  function onDown(e: React.PointerEvent<HTMLDivElement>) {
    startXRef.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function onUp(e: React.PointerEvent<HTMLDivElement>) {
    if (startXRef.current === null) return
    const dx = e.clientX - startXRef.current
    startXRef.current = null
    if (Math.abs(dx) > 50) goTo(indexRef.current + (dx < 0 ? 1 : -1))
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
      <div
        style={{ width:DW, height:DH, position:'relative', animation:'float 3s ease-in-out infinite', cursor:'grab', touchAction:'pan-y', userSelect:'none' }}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => { startXRef.current = null }}
      >
        <div style={{ position:'absolute', top:0, left:0, width:408, height:862, transform:`scale(${SCALE})`, transformOrigin:'top left' }}>
          <BeezPhone>
            <div style={{ opacity:visible?1:0, transition:'opacity 0.3s ease', height:'100%', position:'relative' }}>
              {/* Les six écrans restent montés et seul l'écran courant est opaque :
                  l'image suivante est déjà chargée quand le fondu la révèle. */}
              {SCREENS.map((s, i) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes={IMAGE_SIZES}
                  preload={i === 0} // ex-« priority », renommé dans Next 16
                  draggable={false}
                  aria-hidden={i !== index}
                  style={{ objectFit:'cover', objectPosition:'center top', opacity:i===index?1:0 }}
                />
              ))}
            </div>
          </BeezPhone>
        </div>
      </div>

      <div style={{ display:'flex', gap:6 }}>
        {SCREENS.map((s, i) => (
          <button key={s.src} type="button" aria-label={s.label} onClick={() => goTo(i)}
            style={{ width:i===index?20:6, height:6, borderRadius:3, background:i===index?B.accent:'rgba(255,255,255,0.2)', border:'none', cursor:'pointer', padding:0, transition:'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}
