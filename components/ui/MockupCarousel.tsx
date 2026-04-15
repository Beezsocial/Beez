'use client'

import { useState, useEffect } from 'react'

const FLAT_TOP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'

function MHex({ initial, gradient }: { initial: string; gradient: string }) {
  return (
    <div
      style={{
        width: 34,
        height: 30,
        clipPath: FLAT_TOP,
        background: gradient,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        color: '#082b44',
      }}
    >
      {initial}
    </div>
  )
}

function MCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#0a2540',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: '9px 10px',
        marginBottom: 7,
      }}
    >
      {children}
    </div>
  )
}

function StatusBar({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 2px' }}>
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>9:41</span>
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700 }}>{title}</span>
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>●●●</span>
    </div>
  )
}

const SCREENS = [
  // Screen 1 — Feed
  <div key="feed">
    <StatusBar title="Feed" />
    <MCard>
      <div style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
        <MHex initial="M" gradient="linear-gradient(135deg,#ebaf57,#d4912a)" />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>Martin</span>
            <span style={{ background: 'rgba(235,175,87,0.15)', border: '1px solid rgba(235,175,87,0.4)', color: '#ebaf57', fontSize: 8, padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>✦ FM #001</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>FlowDesk · À l'instant</span>
        </div>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, lineHeight: 1.4, marginBottom: 5 }}>
        Vient de rejoindre la ruche 🐝
      </p>
      <div style={{ display: 'flex', gap: 10, color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
        <span>🍯 14</span><span>💬 6</span>
      </div>
    </MCard>
    <MCard>
      <div style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
        <MHex initial="B" gradient="linear-gradient(135deg,#f472b6,#ef4444)" />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>Blop 🚀</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>· 1h</span>
          </div>
          <span style={{ background: 'rgba(235,175,87,0.12)', color: '#ebaf57', fontSize: 8, padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>250K€ levés</span>
        </div>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, lineHeight: 1.4 }}>Première levée de fonds 🎉</p>
    </MCard>
    <MCard>
      <div style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
        <MHex initial="T" gradient="linear-gradient(135deg,#60a5fa,#3b82f6)" />
        <div>
          <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>Thibault · </span>
          <span style={{ background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.3)', color: '#fb923c', fontSize: 8, padding: '1px 5px', borderRadius: 4, fontWeight: 600 }}>🙋 Aide</span>
        </div>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, lineHeight: 1.4 }}>Comment créer ma chaîne YouTube ?</p>
    </MCard>
  </div>,

  // Screen 2 — Discover
  <div key="discover">
    <StatusBar title="Découvrir" />
    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, marginBottom: 8, textAlign: 'center' }}>Membres récents</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
      {[
        { init: 'S', grad: 'linear-gradient(135deg,#a78bfa,#7c3aed)', name: 'Sophie', role: 'SaaS B2B' },
        { init: 'K', grad: 'linear-gradient(135deg,#34d399,#059669)', name: 'Karim', role: 'Fintech' },
        { init: 'L', grad: 'linear-gradient(135deg,#f59e0b,#d97706)', name: 'Léa', role: 'E-commerce' },
        { init: 'R', grad: 'linear-gradient(135deg,#fb7185,#e11d48)', name: 'Romain', role: 'Dev indep.' },
      ].map(({ init, grad, name, role }) => (
        <div key={name} style={{ background: '#0a2540', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <div style={{ width: 38, height: 33, clipPath: FLAT_TOP, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#082b44' }}>{init}</div>
          </div>
          <p style={{ color: 'white', fontSize: 11, fontWeight: 600, marginBottom: 2 }}>{name}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>{role}</p>
        </div>
      ))}
    </div>
  </div>,

  // Screen 3 — Matching
  <div key="matching">
    <StatusBar title="Matching" />
    <p style={{ color: '#ebaf57', fontSize: 10, fontWeight: 700, textAlign: 'center', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>✦ Nouveaux matches</p>
    {[
      { init: 'A', grad: 'linear-gradient(135deg,#ebaf57,#d4912a)', name: 'Alice', role: 'Investisseur', pct: '94%', desc: 'Cherche des startups SaaS à financer' },
      { init: 'P', grad: 'linear-gradient(135deg,#60a5fa,#2563eb)', name: 'Paul', role: 'Mentor', pct: '87%', desc: 'Accompagne les fondateurs tech' },
    ].map(({ init, grad, name, role, pct, desc }) => (
      <MCard key={name}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <MHex initial={init} gradient={grad} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'white', fontSize: 11, fontWeight: 600 }}>{name}</span>
              <span style={{ color: '#ebaf57', fontSize: 10, fontWeight: 700 }}>{pct}</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>{role}</span>
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, lineHeight: 1.4 }}>{desc}</p>
      </MCard>
    ))}
    <div style={{ background: 'rgba(235,175,87,0.08)', border: '1px solid rgba(235,175,87,0.2)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
      <span style={{ color: '#ebaf57', fontSize: 10, fontWeight: 600 }}>Voir tous les matches →</span>
    </div>
  </div>,

  // Screen 4 — Profile
  <div key="profile">
    <StatusBar title="Profil" />
    <div style={{ textAlign: 'center', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
        <div style={{ width: 56, height: 49, clipPath: FLAT_TOP, background: 'linear-gradient(135deg,#ebaf57,#d4912a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#082b44' }}>C</div>
      </div>
      <p style={{ color: 'white', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Clara D.</p>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(235,175,87,0.12)', border: '1px solid rgba(235,175,87,0.3)', borderRadius: 5, padding: '2px 8px' }}>
        <span style={{ color: '#ebaf57', fontSize: 9, fontWeight: 700 }}>✦ Founding Member #042</span>
      </div>
    </div>
    <MCard>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>À PROPOS</p>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, lineHeight: 1.5 }}>Fondatrice de Necto, une app de suivi de projet pour les agences créatives.</p>
    </MCard>
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {['🐝 Founder', '🔍 Associé', '💰 Financement'].map(tag => (
        <span key={tag} style={{ background: 'rgba(235,175,87,0.1)', border: '1px solid rgba(235,175,87,0.25)', color: '#ebaf57', fontSize: 9, padding: '3px 7px', borderRadius: 10 }}>{tag}</span>
      ))}
    </div>
  </div>,

  // Screen 5 — Startup
  <div key="startup">
    <StatusBar title="Entreprise" />
    <MCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#ebaf57,#d4912a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#082b44' }}>N</div>
        <div>
          <p style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>Necto</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>SaaS · Paris</p>
        </div>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, lineHeight: 1.5, marginBottom: 8 }}>Gestion de projet pour agences créatives. Simplifie le suivi client.</p>
      <div style={{ display: 'flex', gap: 6 }}>
        {[['8', 'membres'], ['24', 'posts'], ['3', 'offres']].map(([n, l]) => (
          <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '5px 4px', textAlign: 'center' }}>
            <p style={{ color: '#ebaf57', fontSize: 13, fontWeight: 700 }}>{n}</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>{l}</p>
          </div>
        ))}
      </div>
    </MCard>
    <MCard>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>OFFRES</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>🤝 Associé CTO</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>Cherche co-fondateur tech</span>
      </div>
    </MCard>
  </div>,

  // Screen 6 — Notifications
  <div key="notifs">
    <StatusBar title="Notifs" />
    {[
      { icon: '✦', color: '#ebaf57', text: 'Nouveau match : Alice (Investisseur)', time: '2m' },
      { icon: '🍯', color: '#f59e0b', text: 'Paul a aimé ton post', time: '14m' },
      { icon: '💬', color: '#60a5fa', text: 'Sophie a répondu à ta question', time: '1h' },
      { icon: '✦', color: '#ebaf57', text: 'Nouveau match : Romain (Dev)', time: '2h' },
      { icon: '🐝', color: '#ebaf57', text: 'Bienvenue dans la ruche !', time: '1j' },
    ].map(({ icon, color, text, time }, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : undefined }}>
        <span style={{ color, fontSize: 13, marginTop: 1 }}>{icon}</span>
        <p style={{ flex: 1, color: 'rgba(255,255,255,0.75)', fontSize: 10, lineHeight: 1.4 }}>{text}</p>
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, flexShrink: 0 }}>{time}</span>
      </div>
    ))}
  </div>,

  // Screen 7 — Messages
  <div key="messages">
    <StatusBar title="Messages" />
    {[
      { init: 'A', grad: 'linear-gradient(135deg,#ebaf57,#d4912a)', name: 'Alice', msg: "Ton projet m'intéresse !", time: '2m', unread: true },
      { init: 'P', grad: 'linear-gradient(135deg,#60a5fa,#2563eb)', name: 'Paul', msg: 'Dispo pour un call ?', time: '1h', unread: true },
      { init: 'S', grad: 'linear-gradient(135deg,#a78bfa,#7c3aed)', name: 'Sophie', msg: 'Super idée 🔥', time: '3h', unread: false },
      { init: 'K', grad: 'linear-gradient(135deg,#34d399,#059669)', name: 'Karim', msg: 'Merci pour le conseil !', time: '1j', unread: false },
    ].map(({ init, grad, name, msg, time, unread }, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : undefined }}>
        <MHex initial={init} gradient={grad} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ color: unread ? 'white' : 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: unread ? 600 : 400 }}>{name}</span>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>{time}</span>
          </div>
          <p style={{ color: unread ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)', fontSize: 10, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{msg}</p>
        </div>
        {unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ebaf57', flexShrink: 0 }} />}
      </div>
    ))}
  </div>,
]

const LABELS = ['Feed', 'Découvrir', 'Matching', 'Profil', 'Startup', 'Notifs', 'Messages']

export default function MockupCarousel() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      const t = setTimeout(() => {
        setIndex((i) => (i + 1) % SCREENS.length)
        setVisible(true)
      }, 400)
      return () => clearTimeout(t)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Phone frame */}
      <div
        style={{
          maxWidth: 280,
          width: '100%',
          background: 'white',
          borderRadius: 40,
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 2px rgba(0,0,0,0.08)',
          padding: 10,
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        {/* Screen */}
        <div
          style={{
            background: '#082b44',
            borderRadius: 30,
            padding: '14px 12px',
            minHeight: 420,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          >
            {SCREENS[index]}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {SCREENS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={LABELS[i]}
            onClick={() => { setVisible(false); setTimeout(() => { setIndex(i); setVisible(true) }, 400) }}
            style={{
              width: i === index ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === index ? '#ebaf57' : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
