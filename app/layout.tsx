import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import ScrollProgress from "@/components/ui/ScrollProgress";

const outfit = Outfit({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-heading' });

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
        url: 'https://www.joinbeez.com/images/beez-og.png',
        width: 1200,
        height: 630,
        alt: 'Beez',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beez',
    description:
      'La communauté pour ceux qui construisent quelque chose. Zéro bullshit corporate.',
    images: ['https://www.joinbeez.com/images/beez-og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Beez',
  url: 'https://www.joinbeez.com',
  logo: 'https://www.joinbeez.com/images/logo-dark-v2.png',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
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
