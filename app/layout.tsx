import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Beez — La ruche des entrepreneurs',
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
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://joinbeez.com'
  ),
  openGraph: {
    title: 'Beez — La ruche des entrepreneurs',
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
        alt: 'Beez — La ruche des entrepreneurs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beez — La ruche des entrepreneurs',
    description:
      'La communauté pour ceux qui construisent quelque chose. Zéro bullshit corporate.',
    images: ['https://www.joinbeez.com/images/beez-og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="fr" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-navy antialiased">{children}</body>
    </html>
  )
}
