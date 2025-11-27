"use client"

import React, { useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children?: React.ReactNode
  width?: number | string
}

export default function Modal({ open, onClose, title, children, width = 640 }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement as HTMLElement

    const node = dialogRef.current
    if (!node) return

    // move focus into the dialog
    const focusable = node.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length) focusable[0].focus()

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
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}>
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : 'Dialog'} className="card p-3 shadow-lg border-0" style={{ width }}>
          <div className="d-flex justify-content-between align-items-start mb-3">
            {title ? <div><h5 className="mb-0">{title}</h5></div> : null}
            <button aria-label="Close dialog" className="btn-close" onClick={onClose}></button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
