'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface ShareButtonProps {
  firstName: string
  memberNumber?: number
}

export default function ShareButton({ firstName, memberNumber }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const shareText = memberNumber
    ? `Je suis Founding Member #${memberNumber} sur Beez — le réseau social pour les entrepreneurs qui construisent en public. Rejoins la ruche 🐝`
    : `Je rejoins Beez — le réseau social pour les entrepreneurs qui construisent en public. Rejoins la ruche 🐝`

  const shareUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://joinbeez.com'

  const handleShare = async () => {
    const shareData: ShareData = {
      title: 'Beez — La ruche des entrepreneurs',
      text: shareText,
      url: shareUrl,
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled — no-op
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch {
        // Clipboard not available
      }
    }
  }

  return (
    <Button onClick={handleShare} fullWidth size="lg">
      {copied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
          Lien copié !
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
          Partager avec la ruche
        </>
      )}
    </Button>
  )
}
