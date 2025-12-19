"use client"

import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'reducedMotionPreference'

export default function ReducedMotionToggle() {
  // start with a deterministic boolean so tests can interact immediately
  const [reduced, setReduced] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) return stored === 'true'
    } catch (e) {
      // ignore
    }
    // default to false until we learn system preference in effect
    return false
  })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      const val = stored === 'true'
      setReduced(val)
      if (val) document.documentElement.classList.add('reduce-motion')
      else document.documentElement.classList.remove('reduce-motion')
      return
    }

    // no preference stored -> follow system pref
    const prefers = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(prefers.matches)
    if (prefers.matches) document.documentElement.classList.add('reduce-motion')
  }, [])

  const toggle = () => {
    const next = !reduced
    setReduced(next)
    localStorage.setItem(STORAGE_KEY, next.toString())
    if (next) document.documentElement.classList.add('reduce-motion')
    else document.documentElement.classList.remove('reduce-motion')
  }

  return (
    <button aria-pressed={!!reduced} title={reduced ? 'Reduced motion: ON' : 'Reduced motion: OFF'} onClick={toggle} className="btn btn-sm btn-outline-secondary me-3" style={{ minWidth: 38 }}>
      {reduced ? '🧊' : '✨'}
    </button>
  )
}
