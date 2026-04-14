'use client'

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  charCount?: number
  maxChars?: number
}

const baseInputClasses = [
  'w-full rounded-beez border text-white placeholder-white/30',
  'px-4 py-3 text-base transition-all duration-200',
  'focus:outline-none focus:border-gold focus:[box-shadow:0_0_0_3px_rgba(235,175,87,0.1)]',
  'disabled:opacity-40 disabled:cursor-not-allowed',
].join(' ')

const baseBg = { background: 'rgba(255,255,255,0.04)' } as const

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white/70"
          >
            {label}
            {props.required && (
              <span className="text-gold ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={baseBg}
          className={[
            baseInputClasses,
            error
              ? 'border-red-500 focus:[box-shadow:0_0_0_3px_rgba(239,68,68,0.1)]'
              : 'border-white/10 hover:border-white/20',
            className,
          ].join(' ')}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-white/40">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, hint, id, charCount, maxChars, className = '', ...props },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white/70"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            style={baseBg}
            className={[
              baseInputClasses,
              'resize-none',
              error
                ? 'border-red-500 focus:[box-shadow:0_0_0_3px_rgba(239,68,68,0.1)]'
                : 'border-white/10 hover:border-white/20',
              className,
            ].join(' ')}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {maxChars !== undefined && charCount !== undefined && (
            <span
              className={[
                'absolute bottom-3 right-3 text-xs tabular-nums',
                charCount > maxChars * 0.9
                  ? charCount >= maxChars
                    ? 'text-red-400'
                    : 'text-gold'
                  : 'text-white/30',
              ].join(' ')}
              aria-live="polite"
            >
              {charCount}/{maxChars}
            </span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-white/40">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
