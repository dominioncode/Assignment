"use client"

import React, { useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children?: React.ReactNode
  width?: number | string
  dialogClassName?: string
  backdropClassName?: string
}

export default function Modal({ open, onClose, title, children, width = 640, dialogClassName, backdropClassName }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement as HTMLElement

    const node = dialogRef.current
    if (!node) return
    let timer: any = undefined

    // move focus into the dialog — prefer form controls first (inputs,
    // textarea, selects). querySelectorAll returns nodes in DOM order, so
    // explicitly prefer form fields by querying them first and falling back
    // to other interactive elements.
    const formControls = node.querySelectorAll<HTMLElement>('input, textarea, select')
    const otherControls = node.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    const focusable = formControls.length ? formControls : otherControls
    if (focusable.length) {
      try {
        console.debug('Modal: focusing first control', focusable[0])
      } catch (err) {
        // ignore console in environments where dev logs are not desired
      }
      // Give the browser a micro-task cycle to settle layout/animations
      // before forcing focus — stabilises tests where the close button or
      // other header element intermittently steals focus.
      const target = focusable[0]

      // Try focusing immediately (RAF) and then poll until focused or we
      // reach a timeout. Polling gives us deterministic behaviour across
      // headless browsers that may delay focus or run extra layout steps.
      requestAnimationFrame(() => target.focus({ preventScroll: true }))

      let attempts = 0
      const maxAttempts = 10
      const intervalMs = 50
      let timer: any = undefined
      timer = setInterval(() => {
        try {
          target.focus({ preventScroll: true })
        } catch (e) {
          // ignore focus exceptions in environments that disallow it
        }

        attempts += 1
        if (document.activeElement === target || attempts >= maxAttempts) {
          clearInterval(timer)
        }
      }, intervalMs)
      // ensure timer is cleared if component unmounts early
      // (we'll clear in the cleanup below)
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      if (e.key === 'Tab') {
        // basic focus trap
        const focusables = Array.from(focusable)
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          ;(last as HTMLElement).focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          ;(first as HTMLElement).focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previouslyFocused.current?.focus()
      try {
        // clear interval if it was started
        if (typeof timer !== 'undefined' && timer) clearInterval(timer)
      } catch (e) {}
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={`modal-backdrop fade show ${backdropClassName || ''}`} style={{ zIndex: 1050, backgroundColor: '#000000' }}>
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : 'Dialog'} className={`card border-0 shadow-lg ${dialogClassName || ''}`} style={{ width, borderRadius: '12px', maxWidth: '90vw', animation: 'slideUp 0.3s ease-out', backgroundColor: '#ffffff' }}>
          <div className="card-header bg-light border-bottom p-4" style={{ borderRadius: '12px 12px 0 0', backgroundColor: '#ffffff' }}>
            <div className="d-flex justify-content-between align-items-start">
              {title ? <h2 className="card-title h5 mb-0 fw-bold text-dark">{title}</h2> : null}
              <button aria-label="Close dialog" className="btn-close" onClick={onClose}></button>
            </div>
          </div>

          <div className="card-body p-4" style={{ backgroundColor: '#ffffff' }}>{children}</div>

          <style>{`
            @keyframes slideUp {
              from {
                transform: translateY(20px);
              }
              to {
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  )
}
