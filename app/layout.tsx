import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import ScrollProgress from "@/components/ui/ScrollProgress";

// Outfit, unique police du site : 400 texte, 500/600 interface, 700 titres,
// 800 pour les titres de page, le mot « Beez » du hero et le compteur de membres.
const outfit = Outfit({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Beez',
  description:
    'Rejoins la première communauté française dédiée aux entrepreneurs qui construisent en public. Partage ton parcours, trouve ton co-fondateur, connecte avec la ruche.',
  keywords: [
    'entrepreneurs',
    'startup',
    'build in public',
    'co-fondateur',
    'réseau social entrepreneurs',
    'communauté startup',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.joinbeez.com'
  ),
  openGraph: {
    title: 'Beez',
    description:
      'La communauté pour ceux qui construisent quelque chose. Zéro bullshit corporate.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Beez',
    images: [
      {
        url: 'https://www.joinbeez.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Beez — Construis. Partage. Connecte.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beez',
    description:
      'La communauté pour ceux qui construisent quelque chose. Zéro bullshit corporate.',
    images: [
      {
        url: 'https://www.joinbeez.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Beez — Construis. Partage. Connecte.',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'FwrcqEFniwQhUItiCYke80bpLS6jMhitFN2RoaCV4-c',
  },
}

export const viewport: Viewport = {
  themeColor: '#041625',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Beez',
  url: 'https://www.joinbeez.com',
  logo: 'https://www.joinbeez.com/images/logo-dark-v3.png',
  description: 'Le réseau social français pour entrepreneurs qui construisent en public',
  sameAs: ['https://www.instagram.com/beez.social'],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Beez',
  url: 'https://www.joinbeez.com',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="fr" className={cn("scroll-smooth", "font-sans", outfit.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-navy antialiased">
        <ScrollProgress />
        {children}
      </body>
    </html>
  )
}
