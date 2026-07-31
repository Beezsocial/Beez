'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { createClient } from '@/lib/supabase/client'
import { submitReport, REPORT_REASONS, type ReportReason } from '@/lib/reports'

type Props = {
  open: boolean
  onClose: () => void
  reporterId: string
  reportedUserId: string
  reportedUserName: string
  conversationContext: string
}

export default function ReportModal({
  open,
  onClose,
  reporterId,
  reportedUserId,
  reportedUserName,
  conversationContext,
}: Props) {
  const [reason, setReason] = useState<ReportReason | ''>('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    if (submitting) return
    onClose()
    // Reset after the exit animation finishes rather than mid-close.
    setTimeout(() => {
      setReason('')
      setDetails('')
      setSubmitted(false)
      setError(null)
    }, 250)
  }

  async function handleSubmit() {
    if (!reason || submitting) return
    setSubmitting(true)
    setError(null)
    const supabase = createClient()
    const { error: submitError } = await submitReport(
      supabase,
      reporterId,
      reportedUserId,
      reason,
      details,
      conversationContext
    )
    setSubmitting(false)
    if (submitError) {
      setError('Une erreur est survenue, réessaie.')
      return
    }
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '0 16px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Signaler cette conversation"
            style={{
              background: '#0a2540',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding: 24,
              maxWidth: 400,
              width: '100%',
            }}
          >
            {submitted ? (
              <>
                <h2 className="font-heading font-bold text-white text-base mb-2">
                  Signalement envoyé
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Signalement envoyé. Notre équipe va l'examiner.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full border border-white/15 text-white/70 hover:text-white hover:border-white/25 font-medium rounded-beez py-2.5 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Fermer
                </button>
              </>
            ) : (
              <>
                <h2 className="font-heading font-bold text-white text-base mb-2">
                  Signaler {reportedUserName}
                </h2>
                <p className="text-white/55 text-sm leading-relaxed mb-4">
                  Explique-nous ce qui ne va pas. Notre équipe examinera ton signalement.
                </p>

                <label className="block text-white/50 text-xs mb-1.5" htmlFor="report-reason">
                  Motif
                </label>
                <select
                  id="report-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReportReason)}
                  className="input-beez mb-4"
                >
                  <option value="" disabled>
                    Choisis un motif
                  </option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>

                <label className="block text-white/50 text-xs mb-1.5" htmlFor="report-details">
                  Détails (optionnel)
                </label>
                <textarea
                  id="report-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Ajoute des précisions si tu le souhaites..."
                  rows={3}
                  maxLength={2000}
                  className="input-beez resize-none mb-4"
                />

                {error && (
                  <p className="text-sm text-red-400 border border-red-500/20 bg-red-500/5 px-3 py-2 mb-4" role="alert">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={submitting}
                    className="flex-1 border border-white/15 text-white/60 hover:text-white/80 hover:border-white/25 font-medium rounded-beez py-2.5 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-40"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!reason || submitting}
                    className="flex-1 gold-gradient gold-shine font-bold text-navy-900 rounded-beez py-2.5 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
                  >
                    {submitting ? 'Envoi...' : 'Envoyer le signalement'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
