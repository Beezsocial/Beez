'use client'

import { useState, useEffect, useRef, useId } from 'react'
import React from 'react'

// ─── Tokens ───────────────────────────────────────────────────────────────────
const B = {
  navy: '#082b44', navyCard: '#0D2E4A', navyDeep: '#051b2d',
  gold: '#ebaf57', white: '#ffffff',
  textDim: 'rgba(255,255,255,0.55)', textSub: 'rgba(255,255,255,0.72)',
  divider: 'rgba(255,255,255,0.08)',
  accentBlue: '#5aa8ff', accentGreen: '#5fd39a', accentPink: '#ff7aa8',
  accentPurple: '#a78bfa', accentOrange: '#ff9557', accentRed: '#ff6b6b',
  font: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
}

function hexPath(W: number) {
  const H = W * Math.sqrt(3) / 2
  return `M ${W*.25} 0 L ${W*.75} 0 L ${W} ${H/2} L ${W*.75} ${H} L ${W*.25} ${H} L 0 ${H/2} Z`
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function HexAvatar({ size = 44, initials = '', fill, gradient }: {
  size?: number; initials?: string; fill?: string; gradient?: string[]
}) {
  const id = useId().replace(/:/g, '')
  const H = size * Math.sqrt(3) / 2
  const bg = gradient ? `url(#g${id})` : (fill || '#1a4b73')
  return (
    <svg width={size} height={H} viewBox={`0 0 ${size} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      {gradient && (
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
        </defs>
      )}
      <path d={hexPath(size)} fill={bg} />
      {initials && (
        <text x={size/2} y={H/2} textAnchor="middle" dominantBaseline="central"
          fill={B.white} fontFamily={B.font} fontWeight="600" fontSize={size * .36}>{initials}</text>
      )}
    </svg>
  )
}

function DoubleHex({ size = 44, person, startup }: {
  size?: number
  person: { gradient?: string[]; fill?: string; initials?: string }
  startup: { gradient?: string[]; fill?: string; initials?: string }
}) {
  const H = size * Math.sqrt(3) / 2
  const sm = size * .62
  return (
    <div style={{ position: 'relative', width: size * 1.2, height: H * 1.25, flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0 }}><HexAvatar size={size} {...person} /></div>
      <div style={{ position: 'absolute', right: 0, bottom: 0, padding: 2, background: B.navyCard, clipPath: 'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)' }}>
        <HexAvatar size={sm} {...startup} />
      </div>
    </div>
  )
}

function HoneycombPattern({ width = 400, height = 200, opacity = .06 }: { width?: number; height?: number; opacity?: number }) {
  const cells: React.ReactNode[] = []
  const s = 28, H = s * Math.sqrt(3) / 2
  for (let row = -1; row < height / H + 1; row++) {
    for (let col = -1; col < width / (s * .75) + 1; col++) {
      const x = col * s * .75, y = row * H + (col % 2 ? H / 2 : 0)
      cells.push(<path key={`${row}-${col}`} d={hexPath(s)} transform={`translate(${x},${y})`} fill="none" stroke={B.gold} strokeWidth="1" opacity={opacity} />)
    }
  }
  return <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>{cells}</svg>
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  home:     (c=B.white) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9.5z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  search:   (c=B.white) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={c} strokeWidth="1.8"/><path d="M20 20l-3.5-3.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  plus:     (c=B.white) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  bell:     (c=B.white) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 9a6 6 0 1112 0c0 4 2 6 2 6H4s2-2 2-6z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 19a2 2 0 004 0" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  message:  (c=B.white) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 4v-4a2 2 0 01-1-1.7V6z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  heart:    (c=B.white, filled=false) => <svg width="20" height="20" viewBox="0 0 24 24" fill={filled?c:'none'}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  comment:  (c=B.white) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2h-7l-4 4v-4H6a2 2 0 01-2-2V5z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  share:    (c=B.white) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bookmark: (c=B.white, filled=false) => <svg width="20" height="20" viewBox="0 0 24 24" fill={filled?c:'none'}><path d="M6 3h12v18l-6-4-6 4V3z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  more:     (c=B.white) => <svg width="18" height="18" viewBox="0 0 24 24" fill={c}><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>,
  play:     (c=B.white) => <svg width="44" height="44" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="rgba(0,0,0,0.55)"/><path d="M20 16l13 8-13 8V16z" fill={c}/></svg>,
  verified: (c=B.gold)  => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.6 1.4 2.1-.3.9 1.9 1.9.9-.3 2.1L15.6 8l-1.4 1.6.3 2.1-1.9.9-.9 1.9-2.1-.3L8 15.6l-1.6-1.4-2.1.3-.9-1.9-1.9-.9.3-2.1L.4 8l1.4-1.6-.3-2.1 1.9-.9.9-1.9 2.1.3L8 1z" fill={c}/><path d="M5.5 8l2 2 3.5-4" stroke={B.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronR: (c=B.white) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronL: (c=B.white) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mic:      (c=B.white) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="12" rx="3" stroke={c} strokeWidth="1.8"/><path d="M5 11a7 7 0 0014 0M12 18v3" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  send:     (c=B.white) => <svg width="18" height="18" viewBox="0 0 24 24" fill={c}><path d="M3 3l18 9-18 9 3-9-3-9z"/></svg>,
  users:    (c=B.white) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5" stroke={c} strokeWidth="1.6"/><circle cx="17" cy="9" r="2.5" stroke={c} strokeWidth="1.6"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M15 20c0-2 2-4 4-4s2.5 1 2.5 3" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  location: (c=B.white) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7 7-13a7 7 0 00-14 0c0 6 7 13 7 13z" stroke={c} strokeWidth="1.8"/><circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth="1.8"/></svg>,
  trend:    (c=B.white) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 17l6-6 4 4 8-8M15 7h6v6" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  spark:    (c=B.gold)  => <svg width="14" height="14" viewBox="0 0 24 24" fill={c}><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"/></svg>,
  check:    (c=B.white) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  camera:   (c=B.white) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke={c} strokeWidth="1.8"/><circle cx="12" cy="13" r="4" stroke={c} strokeWidth="1.8"/></svg>,
}

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

function TopBar({ title = 'Fil', unread = 0 }: { title?: string; unread?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="32" height="28" viewBox="0 0 32 28" style={{ display: 'block' }}>
          <path d={hexPath(32)} fill={B.gold} />
          <text x="16" y="14.5" textAnchor="middle" dominantBaseline="central" fill={B.navy} fontFamily={B.font} fontWeight="800" fontSize="15">B</text>
        </svg>
        <span style={{ fontSize: 22, fontWeight: 700, color: B.white, letterSpacing: '-0.5px' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <IconBtn>{Ic.search()}</IconBtn>
        <div style={{ position: 'relative' }}>
          <IconBtn>{Ic.bell()}</IconBtn>
          {unread > 0 && <div style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: '50%', background: B.gold, boxShadow: `0 0 0 2px ${B.navy}` }} />}
        </div>
      </div>
    </div>
  )
}

function IconBtn({ children, gold }: { children: React.ReactNode; gold?: boolean }) {
  return (
    <div style={{ width: 38, height: 38, borderRadius: 12, background: gold ? B.gold : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  )
}

function TabBar({ active = 'home' }: { active?: string }) {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(5,21,36,0.92)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(235,175,87,0.12)', padding: '10px 12px 28px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 30 }}>
      {(['home','discover','create','messages','profile'] as const).map(key => {
        const isActive = key === active
        const col = isActive ? B.gold : 'rgba(255,255,255,0.45)'
        if (key === 'create') return (
          <div key={key} style={{ width: 48, height: 42, borderRadius: 14, background: `linear-gradient(180deg,${B.gold} 0%,#d89640 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(235,175,87,0.35)' }}>{Ic.plus(B.navy)}</div>
        )
        if (key === 'profile') return (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ padding: isActive ? 1.5 : 0, background: isActive ? B.gold : 'transparent', clipPath: 'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)' }}>
              <HexAvatar size={26} gradient={['#6b4de8','#d84580']} initials="TD" />
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: col }}>Profil</span>
          </div>
        )
        const labels: Record<string,string> = { home:'Fil', discover:'Ruche', messages:'Messages' }
        const icons: Record<string,(c:string)=>React.ReactNode> = { home: Ic.home, discover: Ic.users, messages: Ic.message }
        return (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              {icons[key]?.(col)}
              {key === 'messages' && <div style={{ position: 'absolute', top: -4, right: -6, minWidth: 16, height: 16, borderRadius: 8, padding: '0 4px', background: B.gold, color: B.navy, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: col }}>{labels[key]}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Card Components ──────────────────────────────────────────────────────────
function PostCard({ accent=B.gold, featured=false, style: s={}, children }: { accent?: string; featured?: boolean; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', background: B.navyCard, borderRadius: 18, margin: '10px 14px', overflow: 'hidden', boxShadow: featured ? `0 0 0 1.5px ${B.gold},0 10px 28px rgba(235,175,87,0.22)` : '0 1px 0 rgba(255,255,255,0.04) inset', ...s }}>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: accent, boxShadow: featured ? `0 0 10px ${accent}` : 'none' }} />
      {children}
    </div>
  )
}

function PostHeader({ avatar, doubleAvatar, name, handle, meta, verified=false, startup, timestamp='il y a 2h', menu=true }: {
  avatar?: React.ReactNode
  doubleAvatar?: { person: { gradient?: string[]; fill?: string; initials?: string }; startup: { gradient?: string[]; fill?: string; initials?: string } }
  name: string; handle?: string; meta?: string; verified?: boolean; startup?: string; timestamp?: string; menu?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '14px 16px 10px 18px' }}>
      <div style={{ marginRight: 12 }}>
        {doubleAvatar ? <DoubleHex size={44} {...doubleAvatar} /> : avatar}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: B.white }}>{name}</span>
          {verified && Ic.verified()}
          {startup && <><span style={{ color: B.textDim, fontSize: 13, margin: '0 2px' }}>·</span><span style={{ color: B.gold, fontSize: 13, fontWeight: 600 }}>{startup}</span></>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          {handle && <span style={{ color: B.textDim, fontSize: 12.5 }}>{handle}</span>}
          {meta && <><span style={{ color: B.textDim, fontSize: 12 }}>·</span><span style={{ color: B.textDim, fontSize: 12.5 }}>{meta}</span></>}
          <span style={{ color: B.textDim, fontSize: 12 }}>·</span>
          <span style={{ color: B.textDim, fontSize: 12.5 }}>{timestamp}</span>
        </div>
      </div>
      {menu && <div style={{ marginLeft: 8, padding: 4 }}>{Ic.more(B.textDim)}</div>}
    </div>
  )
}

function PostBody({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '0 16px 12px 18px', fontSize: 14.5, lineHeight: 1.5, color: B.white, letterSpacing: '-0.1px' }}>{children}</div>
}

function PostActions({ likes=0, comments=0, shares=0, liked=false, saved=false }: { likes?: number|string; comments?: number; shares?: number; liked?: boolean; saved?: boolean }) {
  const item = (icon: React.ReactNode, count: number|string, color: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color, fontSize: 13, fontWeight: 500 }}>{icon}<span>{count}</span></div>
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '10px 16px 14px 18px', borderTop: `1px solid ${B.divider}`, marginTop: 4 }}>
      {item(Ic.heart(liked?B.gold:B.textSub, liked), likes, liked?B.gold:B.textSub)}
      {item(Ic.comment(B.textSub), comments, B.textSub)}
      {item(Ic.share(B.textSub), shares, B.textSub)}
      <div style={{ marginLeft: 'auto' }}>{Ic.bookmark(saved?B.gold:B.textSub, saved)}</div>
    </div>
  )
}

function Pill({ children, variant='default', style: s={} }: { children: React.ReactNode; variant?: 'default'|'soft'|'solid'|'hot'; style?: React.CSSProperties }) {
  const v = {
    default: { bg:'rgba(235,175,87,0.12)', color:B.gold, border:'1px solid rgba(235,175,87,0.25)' },
    soft:    { bg:'rgba(255,255,255,0.06)', color:B.textSub, border:'1px solid rgba(255,255,255,0.08)' },
    solid:   { bg:B.gold, color:B.navy, border:'none' },
    hot:     { bg:'rgba(255,107,107,0.14)', color:'#ff8888', border:'1px solid rgba(255,107,107,0.3)' },
  }[variant]
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 9px', borderRadius:100, background:v.bg, color:v.color, border:v.border, fontSize:11, fontWeight:600, ...s }}>{children}</span>
}

function Btn({ children, variant='gold', size='md', style: s={}, full=false, leftIcon }: {
  children: React.ReactNode; variant?: 'gold'|'ghost'|'goldOutline'; size?: 'sm'|'md'|'lg'; style?: React.CSSProperties; full?: boolean; leftIcon?: React.ReactNode
}) {
  const sz = { sm:{pad:'7px 14px',fs:12}, md:{pad:'10px 18px',fs:13}, lg:{pad:'13px 22px',fs:14} }[size]
  const v = {
    gold:        { bg:B.gold, color:B.navy, border:'none', shadow:'0 4px 14px rgba(235,175,87,0.3)' },
    ghost:       { bg:'transparent', color:B.white, border:'1px solid rgba(255,255,255,0.2)', shadow:'none' },
    goldOutline: { bg:'transparent', color:B.gold, border:`1.5px solid ${B.gold}`, shadow:'none' },
  }[variant]
  return (
    <button style={{ padding:sz.pad, fontSize:sz.fs, fontWeight:700, background:v.bg, color:v.color, border:v.border, borderRadius:100, boxShadow:v.shadow, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, cursor:'pointer', fontFamily:B.font, width:full?'100%':'auto', ...s }}>
      {leftIcon}{children}
    </button>
  )
}

function Chips({ items }: { items: { l: string; active?: boolean; badge?: number }[] }) {
  return (
    <div style={{ display:'flex', gap:8, padding:'2px 16px 14px', overflow:'hidden' }}>
      {items.map((c,i) => (
        <div key={i} style={{ padding:'7px 14px', borderRadius:100, fontSize:12.5, fontWeight:600, background:c.active?B.gold:'rgba(255,255,255,0.06)', color:c.active?B.navy:B.textSub, border:c.active?'none':'1px solid rgba(255,255,255,0.08)', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:6 }}>
          {c.l}
          {c.badge && <span style={{ minWidth:16, height:16, borderRadius:8, padding:'0 4px', background:c.active?B.navy:B.gold, color:c.active?B.gold:B.navy, fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{c.badge}</span>}
        </div>
      ))}
    </div>
  )
}

// ─── Screen 1 — Feed ──────────────────────────────────────────────────────────
function Screen1() {
  return (
    <div style={{ position:'relative', height:'100%' }}>
      <div style={{ height:'100%', overflowY:'auto', paddingBottom:90 }}>
        <StatusBar />
        <TopBar title="Fil" unread={3} />
        <Chips items={[{l:'Pour toi',active:true},{l:'Ma ruche'},{l:'SaaS'},{l:'Paris'}]} />
        <PostCard accent={B.gold}>
          <PostHeader name="Beez" verified handle="@beez.fr" meta="Équipe" timestamp="il y a 1h" avatar={<HexAvatar size={44} fill={B.gold} initials="B" />} />
          <PostBody>
            <div style={{ fontSize:17, fontWeight:700, marginBottom:6 }}>Bienvenue dans la Ruche 🐝</div>
            Bâtissez votre startup avec les meilleurs entrepreneurs francophones.
          </PostBody>
          <div style={{ display:'flex', gap:8, padding:'0 16px 14px 18px', flexWrap:'wrap' }}>
            <Pill variant="solid">✨ Épinglé</Pill><Pill>#communauté</Pill><Pill variant="soft">2 341 réponses</Pill>
          </div>
          <PostActions likes="1.2k" comments={342} shares={89} liked />
        </PostCard>
        <PostCard accent={B.accentGreen}>
          <PostHeader name="Camille Laurent" handle="@camille.l" meta="CEO" startup="Nectar" timestamp="il y a 3h"
            doubleAvatar={{ person:{gradient:['#d84580','#f5a623'],initials:'CL'}, startup:{fill:'#1a7a4e',initials:'N'} }} />
          <PostBody>
            On vient de passer le cap des <b style={{ color:B.accentGreen }}>100 premiers clients payants</b> sur Nectar 🎉<br/><br/>
            18 mois, 2 pivots, 0 levée.
          </PostBody>
          <div style={{ margin:'4px 16px 12px 18px', padding:'14px 16px', borderRadius:14, background:'rgba(95,211,154,0.08)', border:'1px solid rgba(95,211,154,0.2)', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'rgba(95,211,154,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🎯</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:B.textDim, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.4px' }}>Jalon</div>
              <div style={{ fontSize:15, fontWeight:700, color:B.white, marginTop:1 }}>100 clients payants</div>
            </div>
            <div style={{ fontSize:22, fontWeight:800, color:B.accentGreen }}>100<span style={{ fontSize:11, color:B.textDim, marginLeft:3 }}>/100</span></div>
          </div>
          <PostActions likes={486} comments={73} shares={24} liked />
        </PostCard>
        <PostCard accent={B.accentOrange}>
          <PostHeader name="Mehdi Ouaziz" handle="@mehdi.o" meta="Fondateur" startup="Atelier Zéro" timestamp="il y a 5h"
            doubleAvatar={{ person:{gradient:['#5aa8ff','#6b4de8'],initials:'MO'}, startup:{fill:'#ff9557',initials:'AZ'} }} />
          <div style={{ padding:'0 16px 8px 18px', display:'flex', gap:6 }}>
            <Pill variant="hot">🆘 Besoin d'aide</Pill><Pill variant="soft">Growth</Pill>
          </div>
          <PostBody>Quelqu'un a travaillé avec un cabinet pour un <b>crédit d'impôt recherche</b> sur un projet IA ?</PostBody>
          <PostActions likes={42} comments={18} shares={3} />
        </PostCard>
      </div>
      <TabBar active="home" />
    </div>
  )
}

// ─── Screen 2 — Feed (Ma ruche) ───────────────────────────────────────────────
function Screen2() {
  return (
    <div style={{ position:'relative', height:'100%' }}>
      <div style={{ height:'100%', overflowY:'auto', paddingBottom:90 }}>
        <StatusBar />
        <TopBar title="Fil" unread={3} />
        <Chips items={[{l:'Pour toi'},{l:'Ma ruche',active:true},{l:'Médias'},{l:'Levées'}]} />
        <PostCard accent={B.accentRed}>
          <PostHeader name="Sarah Benali" handle="@sarah.b" meta="Co-founder" startup="Flora" timestamp="il y a 4h"
            doubleAvatar={{ person:{gradient:['#ff7aa8','#a78bfa'],initials:'SB'}, startup:{fill:'#1a7a4e',initials:'F'} }} />
          <PostBody>Interview sur le product-market fit. Marc est brutal mais juste 👇</PostBody>
          <div style={{ margin:'4px 16px 12px 18px', borderRadius:14, overflow:'hidden', position:'relative', aspectRatio:'16/9', background:'linear-gradient(135deg,#c73a3a 0%,#6b1e1e 50%,#2a0808 100%)' }}>
            <div style={{ position:'absolute', inset:0, padding:14, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div style={{ padding:'4px 8px', borderRadius:4, background:'#c00', color:'#fff', fontSize:10, fontWeight:700 }}>▶ YOUTUBE</div>
                <div style={{ padding:'3px 7px', borderRadius:4, background:'rgba(0,0,0,0.7)', color:'#fff', fontSize:10, fontWeight:700 }}>24:13</div>
              </div>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:'#fff', lineHeight:1.15 }}>Comment j'ai tué mon PMF</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.85)', marginTop:4 }}>Marc Lanvin · 48k vues</div>
              </div>
            </div>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}>{Ic.play()}</div>
          </div>
          <PostActions likes={234} comments={56} shares={41} />
        </PostCard>
        <PostCard accent={B.accentPurple}>
          <PostHeader name="Thibault Renard" handle="@thibault.r" meta="CEO" startup="Ruche Verte" timestamp="il y a 6h"
            doubleAvatar={{ person:{gradient:['#a78bfa','#5aa8ff'],initials:'TR'}, startup:{fill:'#3e7a4a',initials:'RV'} }} />
          <PostBody>On lance notre campagne sur <b>Ulule</b> aujourd'hui. 30 jours pour financer notre première ligne 💚</PostBody>
          <div style={{ margin:'4px 16px 12px 18px', borderRadius:14, overflow:'hidden', background:'rgba(167,139,250,0.05)', border:'1px solid rgba(167,139,250,0.2)' }}>
            <div style={{ height:80, background:'linear-gradient(135deg,#3e6a4a 0%,#7a9563 60%,#c9b87a 100%)', display:'flex', alignItems:'flex-start', padding:10 }}>
              <div style={{ padding:'4px 10px', borderRadius:4, background:'#fff', color:'#1a1a1a', fontSize:10, fontWeight:800 }}>ULULE</div>
            </div>
            <div style={{ padding:'12px 14px' }}>
              <div style={{ fontSize:14, fontWeight:700, color:B.white }}>Ruche Verte — filtres à eau low-tech</div>
              <div style={{ marginTop:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:16, fontWeight:800, color:B.accentPurple }}>18 420 €</span>
                  <span style={{ fontSize:11, color:B.textDim }}>sur 25 000 €</span>
                </div>
                <div style={{ height:6, borderRadius:100, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                  <div style={{ width:'73%', height:'100%', background:`linear-gradient(90deg,${B.accentPurple},#d4a3ff)`, borderRadius:100 }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:11, color:B.textSub }}>
                  <span><b style={{ color:B.white }}>73%</b> financé</span>
                  <span><b style={{ color:B.white }}>29 j</b> restants</span>
                </div>
              </div>
            </div>
          </div>
          <PostActions likes={189} comments={42} shares={67} liked saved />
        </PostCard>
        <PostCard accent={B.gold}>
          <PostHeader name="Défi Beez" verified handle="@beez.defis" timestamp="Nouveau" avatar={<HexAvatar size={44} fill={B.gold} initials="🏆" />} />
          <div style={{ padding:'0 16px 10px 18px' }}>
            <div style={{ fontSize:11, color:B.gold, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase' }}>Défi #14 · Semaine 42</div>
            <div style={{ fontSize:20, fontWeight:800, color:B.white, marginTop:4, lineHeight:1.15 }}>Trouve 10 clients potentiels en 48h.</div>
            <div style={{ display:'flex', gap:10, marginTop:10 }}>
              {[['234','Participants'],['47h 12m','Restant']].map(([n,l],i) => (
                <div key={i} style={{ flex:1, padding:12, borderRadius:12, background:'rgba(235,175,87,0.08)', border:'1px solid rgba(235,175,87,0.18)' }}>
                  <div style={{ fontSize:18, fontWeight:800, color:B.gold }}>{n}</div>
                  <div style={{ fontSize:10.5, color:B.textDim, textTransform:'uppercase', letterSpacing:'0.4px', fontWeight:600 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:'0 16px 14px 18px' }}><Btn variant="gold" full>Relever le défi →</Btn></div>
        </PostCard>
      </div>
      <TabBar active="home" />
    </div>
  )
}

// ─── Screen 3 — Match ─────────────────────────────────────────────────────────
function Screen3() {
  return (
    <div style={{ position:'relative', height:'100%' }}>
      <div style={{ height:'100%', overflowY:'auto', paddingBottom:90 }}>
        <StatusBar />
        <TopBar title="Fil" unread={3} />
        <div style={{ margin:'2px 14px 14px', padding:'14px 16px', borderRadius:16, background:'linear-gradient(135deg,rgba(235,175,87,0.18) 0%,rgba(235,175,87,0.06) 100%)', border:`1px solid ${B.gold}`, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:B.gold, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🧬</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, color:B.gold, letterSpacing:'0.8px', textTransform:'uppercase' }}>Match IA · 94%</div>
            <div style={{ fontSize:14, fontWeight:700, color:B.white, marginTop:2 }}>3 nouveaux profils correspondent</div>
          </div>
          {Ic.chevronR(B.gold)}
        </div>
        <div style={{ padding:'0 14px 2px', fontSize:11, fontWeight:700, color:B.gold, letterSpacing:'1.4px', textTransform:'uppercase', display:'flex', alignItems:'center', gap:6 }}>
          {Ic.spark()} Mis en avant dans ta ruche
        </div>
        <PostCard accent={B.gold} featured>
          <PostHeader name="Léa Moreau" verified handle="@lea.m" meta="Tech lead · Ex-Doctolib" timestamp="il y a 2h"
            avatar={<div style={{ padding:2, background:B.gold, clipPath:'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)' }}><HexAvatar size={44} gradient={['#f5a623','#d84580']} initials="LM" /></div>} />
          <div style={{ padding:'0 16px 10px 18px', display:'flex', gap:6, flexWrap:'wrap' }}>
            <Pill variant="solid">👥 Cherche Co-fondateur</Pill><Pill variant="soft">CTO / Tech</Pill>
          </div>
          <PostBody>
            3 ans chez Doctolib, j'ai mon idée (HealthTech B2B). Je cherche un <b style={{ color:B.gold }}>CTO full-stack</b> pour le MVP, equity 50/50.
          </PostBody>
          <div style={{ margin:'4px 16px 12px 18px', padding:14, borderRadius:14, background:'rgba(235,175,87,0.08)', border:'1px solid rgba(235,175,87,0.22)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:B.gold, textTransform:'uppercase', letterSpacing:'0.6px' }}>Compatibilité IA</div>
              <div style={{ flex:1, height:1, background:'rgba(235,175,87,0.2)' }} />
              <div style={{ fontSize:18, fontWeight:800, color:B.gold }}>94%</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[['Expérience','HealthTech'],['Stack rêvée','TS / Rails'],['Rythme','Intense'],['Valeurs','Long-term']].map(([label,v],i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:16, height:16, borderRadius:'50%', background:B.gold, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Ic.check(B.navy)}</div>
                  <div>
                    <div style={{ fontSize:10, color:B.textDim, textTransform:'uppercase', letterSpacing:'0.3px' }}>{label}</div>
                    <div style={{ fontSize:12.5, color:B.white, fontWeight:600 }}>{v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:'0 16px 12px 18px' }}>
            <Btn variant="gold" full leftIcon={Ic.message(B.navy)}>Envoyer un message</Btn>
          </div>
          <PostActions likes={127} comments={34} shares={12} saved />
        </PostCard>
      </div>
      <TabBar active="home" />
    </div>
  )
}

// ─── Screen 4 — Profile ───────────────────────────────────────────────────────
function Screen4() {
  return (
    <div style={{ height:'100%', overflowY:'auto' }}>
      <StatusBar />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 18px 8px' }}>
        <IconBtn>{Ic.chevronL()}</IconBtn>
        <span style={{ fontSize:14, fontWeight:700, color:B.textSub }}>Profil</span>
        <IconBtn>{Ic.more()}</IconBtn>
      </div>
      <div style={{ position:'relative', height:130, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg,#0a3858 0%,${B.navyDeep} 100%)` }} />
        <HoneycombPattern width={400} height={140} opacity={0.14} />
      </div>
      <div style={{ position:'relative', padding:'0 20px', marginTop:-56 }}>
        <div style={{ display:'flex', alignItems:'flex-end', gap:12 }}>
          <div style={{ padding:4, background:B.gold, clipPath:'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)', filter:'drop-shadow(0 10px 22px rgba(0,0,0,0.45))' }}>
            <HexAvatar size={108} gradient={['#f5a623','#d84580']} initials="TD" />
          </div>
          <div style={{ flex:1, paddingBottom:8, display:'flex', justifyContent:'flex-end' }}>
            <Btn variant="goldOutline" size="sm">Suivre</Btn>
          </div>
        </div>
      </div>
      <div style={{ padding:'16px 20px 0' }}>
        <div style={{ display:'inline-flex', alignItems:'stretch' }}>
          <div style={{ background:B.gold, padding:'10px 18px 10px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:22, fontWeight:800, color:B.navy }}>Théo Durand</span>
            {Ic.verified(B.navy)}
          </div>
          <svg width="28" height="46" viewBox="0 0 28 46" style={{ display:'block' }}>
            <path d="M 0 0 L 0 46 L 4 46 L 28 23 L 4 0 Z" fill={B.gold} />
          </svg>
        </div>
        <div style={{ fontSize:13.5, color:B.textSub, marginTop:6, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span>@theo.d</span><span style={{ color:B.textDim }}>·</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>{Ic.location(B.textSub)} Lyon</span>
        </div>
      </div>
      <div style={{ padding:'14px 20px 0' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:12, padding:'10px 16px 10px 10px', borderRadius:100, background:'linear-gradient(90deg,rgba(235,175,87,0.2) 0%,rgba(235,175,87,0.05) 100%)', border:`1px solid ${B.gold}` }}>
          <div style={{ position:'relative' }}>
            <HexAvatar size={30} fill={B.gold} />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>👑</div>
          </div>
          <div>
            <div style={{ fontSize:10.5, color:B.gold, fontWeight:700, letterSpacing:'0.8px', textTransform:'uppercase' }}>Founding Member</div>
            <div style={{ fontSize:14, color:B.white, fontWeight:800, fontFamily:'ui-monospace,"SF Mono",monospace' }}>#001 / 1000</div>
          </div>
        </div>
      </div>
      <div style={{ padding:'16px 20px 0', fontSize:14, lineHeight:1.5, color:B.textSub }}>
        Fondateur <b style={{ color:B.gold }}>@Nectar</b> · ex-Qonto · j'écris sur le bootstrap B2B.
      </div>
      <div style={{ display:'flex', margin:'18px 20px 0', borderRadius:18, background:B.navyCard, border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden' }}>
        {[['2 847','Abeilles'],['412','Ruche'],['128','Aides']].map(([v,l],i) => (
          <div key={i} style={{ flex:1, padding:'14px 10px', textAlign:'center', borderLeft:i>0?'1px solid rgba(255,255,255,0.06)':'none' }}>
            <div style={{ fontSize:20, fontWeight:800, color:B.white }}>{v}</div>
            <div style={{ fontSize:11, color:B.textDim, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.3px' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:24, padding:'18px 20px 10px', borderBottom:`1px solid ${B.divider}` }}>
        {['Publications','Startups','Aides','À propos'].map((t,i) => (
          <div key={i} style={{ position:'relative', paddingBottom:10, fontSize:13.5, fontWeight:700, color:i===0?B.gold:B.textDim }}>
            {t}
            {i===0 && <div style={{ position:'absolute', bottom:-1, left:0, right:0, height:2, background:B.gold, borderRadius:2 }} />}
          </div>
        ))}
      </div>
      <div style={{ padding:'10px 20px 6px', fontSize:11, color:B.textDim, fontWeight:700, letterSpacing:'0.8px', textTransform:'uppercase' }}>📌 Épinglé</div>
      <PostCard accent={B.gold} style={{ margin:'4px 14px 20px' }}>
        <PostHeader name="Théo Durand" verified handle="@theo.d" startup="Nectar" timestamp="il y a 2j" menu={false}
          doubleAvatar={{ person:{gradient:['#f5a623','#d84580'],initials:'TD'}, startup:{fill:'#1a7a4e',initials:'N'} }} />
        <PostBody>Pourquoi j'ai refusé 400k€ de seed cette semaine. Un thread long 🧵</PostBody>
        <PostActions likes="2.1k" comments={184} shares={312} liked />
      </PostCard>
    </div>
  )
}

// ─── Screen 5 — Startup ───────────────────────────────────────────────────────
function StatCard({ label, value, delta, sub, color }: { label: string; value: string; delta?: string; sub?: string; color: string }) {
  return (
    <div style={{ padding:'14px 16px', borderRadius:16, background:B.navyCard, border:'1px solid rgba(255,255,255,0.06)', borderLeft:`3px solid ${color}` }}>
      <div style={{ fontSize:10.5, color:B.textDim, fontWeight:700, letterSpacing:'0.6px', textTransform:'uppercase' }}>{label}</div>
      <div style={{ fontSize:22, color:B.white, fontWeight:800, marginTop:3 }}>{value}</div>
      <div style={{ fontSize:11, color, marginTop:2, fontWeight:600 }}>{delta||sub}</div>
    </div>
  )
}

function Screen5() {
  const BRAND = '#1a7a4e', BRAND2 = '#3fb082'
  return (
    <div style={{ height:'100%', overflowY:'auto' }}>
      <StatusBar />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 18px 8px' }}>
        <IconBtn>{Ic.chevronL()}</IconBtn>
        <span style={{ fontSize:14, fontWeight:700, color:B.textSub }}>Startup</span>
        <IconBtn>{Ic.share()}</IconBtn>
      </div>
      <div style={{ position:'relative', height:100, margin:'0 14px', borderRadius:18, overflow:'hidden', background:`linear-gradient(135deg,${BRAND} 0%,${BRAND2} 100%)` }}>
        <HoneycombPattern width={400} height={100} opacity={0.2} />
      </div>
      <div style={{ padding:'0 20px', marginTop:-40, display:'flex', alignItems:'flex-end', gap:14 }}>
        <div style={{ padding:4, background:B.navy, clipPath:'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)', filter:'drop-shadow(0 8px 20px rgba(0,0,0,0.35))' }}>
          <HexAvatar size={78} fill={BRAND} initials="N" />
        </div>
        <div style={{ flex:1, paddingBottom:6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:24, fontWeight:800, color:B.white }}>Nectar</span>{Ic.verified()}
          </div>
          <div style={{ fontSize:12.5, color:B.textDim, marginTop:2 }}>nectar.fr · CRM pour artisans</div>
        </div>
      </div>
      <div style={{ padding:'14px 20px 0', fontSize:14, lineHeight:1.5, color:B.textSub }}>Le CRM pour les artisans. Devis en 3 min, relances auto.</div>
      <div style={{ display:'flex', gap:10, padding:'14px 20px 0' }}>
        <Btn variant="gold" leftIcon={<span style={{ fontSize:14 }}>🐝</span>}>S'abonner</Btn>
        <Btn variant="ghost">Message</Btn>
      </div>
      <div style={{ margin:'16px 14px 0', padding:'16px 18px', borderRadius:18, background:'linear-gradient(135deg,rgba(235,175,87,0.14) 0%,rgba(235,175,87,0.04) 100%)', border:'1px solid rgba(235,175,87,0.3)', display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ display:'flex' }}>
          {['#f5a623','#d84580','#5aa8ff'].map((c,i) => (
            <div key={i} style={{ marginLeft:i>0?-10:0, padding:1.5, background:B.navy, clipPath:'polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)' }}>
              <HexAvatar size={28} fill={c} />
            </div>
          ))}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:22, fontWeight:800, color:B.white }}>1 284 <span style={{ color:B.gold }}>abeilles</span></div>
          <div style={{ fontSize:12, color:B.textDim, marginTop:1 }}>suivent · <span style={{ color:B.accentGreen }}>+47 cette semaine</span></div>
        </div>
        {Ic.trend(B.gold)}
      </div>
      <div style={{ padding:'14px 14px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        <StatCard label="MRR" value="42 K€" delta="+18%" color={B.accentGreen} />
        <StatCard label="Clients" value="127" delta="+12 ce mois" color={BRAND2} />
        <StatCard label="Équipe" value="4" sub="fondateurs + 2" color={B.accentPurple} />
        <StatCard label="Stade" value="Seed" sub="bootstrap" color={B.gold} />
      </div>
      <div style={{ padding:'18px 20px 0', fontSize:11, color:B.textDim, fontWeight:700, letterSpacing:'0.8px', textTransform:'uppercase' }}>Jalons</div>
      <div style={{ margin:'8px 14px 20px', padding:16, borderRadius:18, background:B.navyCard, border:'1px solid rgba(255,255,255,0.06)' }}>
        {[
          { date:'Oct 2025', t:'100 clients payants', hot:true },
          { date:'Jui 2025', t:'Lancement v2 · Pennylane' },
          { date:'Mar 2025', t:'Premier recrutement · Léa' },
          { date:'Nov 2024', t:'Idéation · premier devis', last:true },
        ].map((m,i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, paddingBottom:m.last?0:14 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:16, height:16, borderRadius:'50%', background:m.hot?B.gold:BRAND2, boxShadow:m.hot?`0 0 10px ${B.gold}`:'none', flexShrink:0 }} />
              {!m.last && <div style={{ width:1.5, flex:1, background:'rgba(255,255,255,0.1)', marginTop:2, minHeight:20 }} />}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10.5, color:B.textDim, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.4px' }}>{m.date}</div>
              <div style={{ fontSize:13.5, color:B.white, fontWeight:600, marginTop:1 }}>{m.t}</div>
            </div>
            {m.hot && <Pill variant="solid">🏆 récent</Pill>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Screen 6 — Notifications ─────────────────────────────────────────────────
function MatchNotif({ percent, name, role, gradient, initials, reason, when, unread, hot }: {
  percent: number; name: string; role: string; gradient: string[]; initials: string;
  reason: string; when: string; unread?: boolean; hot?: boolean
}) {
  const color = percent >= 90 ? B.gold : B.accentPurple
  return (
    <div style={{ margin:'6px 14px', borderRadius:18, background:unread?B.navyCard:'transparent', border:unread?'1px solid rgba(255,255,255,0.06)':'none', borderLeft:`4px solid ${color}`, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, position:'relative', overflow:'hidden' }}>
      {hot && <div style={{ position:'absolute', top:-10, right:-10, width:60, height:60, borderRadius:'50%', background:`radial-gradient(circle,rgba(235,175,87,0.2) 0%,transparent 70%)` }} />}
      <HexAvatar size={44} gradient={gradient} initials={initials} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:14, fontWeight:700, color:B.white }}>{name}</span>
          {unread && <div style={{ width:7, height:7, borderRadius:'50%', background:B.gold }} />}
        </div>
        <div style={{ fontSize:12, color:B.textDim, marginTop:1 }}>{role}</div>
        <div style={{ fontSize:12, color:B.textSub, marginTop:4 }}><span style={{ color:B.gold }}>✦</span> {reason}</div>
        <div style={{ fontSize:11, color:B.textDim, marginTop:4 }}>{when}</div>
      </div>
      <div style={{ position:'relative', width:54, height:54, flexShrink:0 }}>
        <svg width="54" height="54" viewBox="0 0 54 54">
          <circle cx="27" cy="27" r="23" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
          <circle cx="27" cy="27" r="23" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${(percent/100)*144.5} 144.5`} strokeLinecap="round" transform="rotate(-90 27 27)" />
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontSize:14, fontWeight:800, color }}>{percent}%</div>
        </div>
      </div>
    </div>
  )
}

function Screen6() {
  return (
    <div style={{ height:'100%', overflowY:'auto' }}>
      <StatusBar />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 18px 4px' }}>
        <IconBtn>{Ic.chevronL()}</IconBtn>
        <span style={{ fontSize:22, fontWeight:700, color:B.white }}>Notifications</span>
        <div style={{ width:38 }} />
      </div>
      <Chips items={[{l:'Tout'},{l:'Matchs IA',active:true,badge:3},{l:'Mentions'},{l:'Ruche'}]} />
      <div style={{ padding:'0 20px 6px', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:22, height:22, borderRadius:6, background:B.gold, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>🧬</div>
        <span style={{ fontSize:11, color:B.gold, fontWeight:700, letterSpacing:'0.8px', textTransform:'uppercase' }}>Aujourd'hui · Matching IA</span>
      </div>
      <MatchNotif percent={87} name="Amélie Roux" role="Designer produit · Ex-Blablacar" gradient={['#5aa8ff','#a78bfa']} initials="AR" reason="Cherche co-fondateur · B2B SaaS" when="il y a 12 min" unread />
      <MatchNotif percent={91} name="Kevin Dubois" role="Full-stack engineer · Nantes" gradient={['#5fd39a','#5aa8ff']} initials="KD" reason="Stack TS/Rails · valeurs long-term" when="il y a 1h" hot unread />
      <div style={{ margin:'6px 14px', borderRadius:18, overflow:'hidden', background:'linear-gradient(135deg,rgba(255,122,168,0.12) 0%,rgba(235,175,87,0.06) 100%)', border:`1px solid ${B.gold}`, position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, bottom:0, width:4, background:B.gold }} />
        <div style={{ padding:'14px 16px 14px 18px', display:'flex', alignItems:'flex-start', gap:12 }}>
          <HexAvatar size={40} gradient={['#ff7aa8','#f5a623']} initials="JM" />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
              <Pill variant="solid">✨ Demande entrante</Pill>
              <span style={{ fontSize:11, color:B.textDim }}>il y a 3 min</span>
            </div>
            <div style={{ fontSize:14.5, color:B.white, marginTop:8, lineHeight:1.4 }}>
              <b>Julien Martel</b> veut te connecter — il cherche un CEO FinTech.
            </div>
            <div style={{ marginTop:10, padding:'10px 12px', borderRadius:10, background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.06)', fontSize:13, color:B.textSub, lineHeight:1.4, fontStyle:'italic' }}>
              « J'ai lu ton thread sur le bootstrap B2B. Café ? »
            </div>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <Btn variant="gold" size="sm">Accepter</Btn>
              <Btn variant="ghost" size="sm">Voir le profil</Btn>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding:'18px 20px 6px', fontSize:11, color:B.textDim, fontWeight:700, letterSpacing:'0.8px', textTransform:'uppercase' }}>Cette semaine</div>
      {[
        { icon:'❤️', color:B.accentPink, text:<><b>Camille L.</b> et <b>47 autres</b> ont aimé ta publication</>, when:'il y a 2h' },
        { icon:'🎯', color:B.accentGreen, text:<>Nouveau jalon · <b>Nectar</b> · 100 clients</>, when:'hier' },
      ].map((n,i) => (
        <div key={i} style={{ margin:'4px 14px', padding:'12px 16px', display:'flex', alignItems:'center', gap:12, borderBottom:`1px solid ${B.divider}` }}>
          <div style={{ width:38, height:38, borderRadius:12, background:`${n.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>{n.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, color:B.textSub, lineHeight:1.4 }}>{n.text}</div>
            <div style={{ fontSize:11, color:B.textDim, marginTop:2 }}>{n.when}</div>
          </div>
        </div>
      ))}
      <div style={{ height:20 }} />
    </div>
  )
}

// ─── Screen 7 — Messages ──────────────────────────────────────────────────────
function Screen7() {
  const convos = [
    { name:'Kevin Dubois', last:'Touché. On en parle jeudi…', time:'14:11', unread:0, active:true, grad:['#5fd39a','#5aa8ff'], initials:'KD', match:91, online:true },
    { name:'Amélie Roux', last:'Tu as 5 min pour un quick chat ?', time:'11:42', unread:2, grad:['#5aa8ff','#a78bfa'], initials:'AR', match:87 },
    { name:'Léa Moreau', last:"Super, je t'envoie le Notion", time:'hier', unread:0, grad:['#f5a623','#d84580'], initials:'LM' },
    { name:'Julien Martel', last:'📎 Pitch deck v2.pdf', time:'hier', unread:1, grad:['#ff7aa8','#f5a623'], initials:'JM' },
    { name:'Camille Laurent', last:'Bravo pour les 100 clients 🎉', time:'lun.', unread:0, grad:['#d84580','#f5a623'], initials:'CL' },
    { name:'Ruche Paris · SaaS', last:'Thibault : qqn utilise Stripe Tax ?', time:'lun.', unread:4, grad:['#a78bfa','#5aa8ff'], initials:'RP' },
  ]
  return (
    <div style={{ position:'relative', height:'100%' }}>
      <div style={{ height:'100%', overflowY:'auto', paddingBottom:90 }}>
        <StatusBar />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 18px 4px' }}>
          <span style={{ fontSize:26, fontWeight:800, color:B.white }}>Messages</span>
          <div style={{ display:'flex', gap:10 }}>
            <IconBtn>{Ic.search()}</IconBtn>
            <IconBtn gold>{Ic.plus(B.navy)}</IconBtn>
          </div>
        </div>
        <Chips items={[{l:'Tout',active:true},{l:'✦ Matchs'},{l:'Ruches'},{l:'Non lus',badge:7}]} />
        {convos.map((c,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 18px', background:c.active?'rgba(235,175,87,0.06)':'transparent', borderLeft:c.active?`3px solid ${B.gold}`:'3px solid transparent' }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <HexAvatar size={46} gradient={c.grad} initials={c.initials} />
              {c.online && <div style={{ position:'absolute', bottom:2, right:-2, width:11, height:11, borderRadius:'50%', background:B.accentGreen, border:`2px solid ${B.navy}` }} />}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:14.5, fontWeight:700, color:B.white, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</span>
                {c.match && <span style={{ fontSize:10, color:B.gold, fontWeight:700 }}>✦{c.match}%</span>}
              </div>
              <div style={{ fontSize:12.5, color:c.unread?B.white:B.textDim, fontWeight:c.unread?600:400, marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.last}</div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontSize:11, color:c.unread?B.gold:B.textDim, fontWeight:c.unread?700:500 }}>{c.time}</div>
              {c.unread > 0 && (
                <div style={{ marginTop:4, marginLeft:'auto', minWidth:20, height:20, borderRadius:10, padding:'0 6px', background:B.gold, color:B.navy, fontSize:11, fontWeight:800, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{c.unread}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <TabBar active="messages" />
    </div>
  )
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────
function BeezPhone({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position:'relative', width:408, height:862, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:62 }}>
      <div style={{ position:'absolute', inset:-28, borderRadius:90, background:'radial-gradient(60% 50% at 50% 50%,rgba(235,175,87,0.32) 0%,rgba(235,175,87,0.12) 40%,transparent 75%)', filter:'blur(18px)', pointerEvents:'none' }} />
      <div style={{ position:'relative', width:390, height:844, borderRadius:54, background:'#000', padding:9, boxShadow:'0 0 0 2px rgba(235,175,87,0.4),0 0 30px rgba(235,175,87,0.35),0 0 60px rgba(235,175,87,0.18),0 40px 80px rgba(0,0,0,0.4)' }}>
        <div style={{ width:'100%', height:'100%', borderRadius:46, overflow:'hidden', background:B.navy, position:'relative', fontFamily:B.font, color:B.white, fontSize:16 }}>
          <div style={{ position:'absolute', top:10, left:'50%', transform:'translateX(-50%)', width:120, height:34, borderRadius:20, background:'#000', zIndex:40 }} />
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Carousel ─────────────────────────────────────────────────────────────────
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7]
const LABELS  = ['Fil', 'Ma Ruche', 'Matching', 'Profil', 'Startup', 'Notifs', 'Messages']
const SCALE   = 0.72
const DW      = Math.round(408 * SCALE)  // 294
const DH      = Math.round(862 * SCALE)  // 621

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  const Screen = SCREENS[index]

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
            <div style={{ opacity:visible?1:0, transition:'opacity 0.3s ease', height:'100%' }}>
              <Screen />
            </div>
          </BeezPhone>
        </div>
      </div>

      <div style={{ display:'flex', gap:6 }}>
        {SCREENS.map((_,i) => (
          <button key={i} type="button" aria-label={LABELS[i]} onClick={() => goTo(i)}
            style={{ width:i===index?20:6, height:6, borderRadius:3, background:i===index?'#ebaf57':'rgba(255,255,255,0.2)', border:'none', cursor:'pointer', padding:0, transition:'all 0.3s ease' }} />
        ))}
      </div>
    </div>
  )
}
