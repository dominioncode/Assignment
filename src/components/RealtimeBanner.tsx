'use client'

import React, { useEffect, useState } from 'react'
import KOMU_CONFIG from '@/config/komu.config'
import { getFlags } from '@/lib/featureFlags'

export default function RealtimeBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const refresh = () => {
      const flags = getFlags()
      if (flags.realtimeNotifications) {
        const hidden = localStorage.getItem('komu_hide_realtime_banner')
        setVisible(hidden !== '1')
      } else {
        setVisible(false)
      }
    }

    refresh()
    const onChange = () => refresh()
    window.addEventListener('komu:features:changed', onChange)

    return () => window.removeEventListener('komu:features:changed', onChange)
  }, [])

  if (!visible) return null

  return (
    <div className="alert alert-info d-flex justify-content-between align-items-center m-0" role="alert" style={{ borderRadius: 0 }}>
      <div>
        <strong>Realtime Notifications enabled</strong>
        <div className="small">You will receive instant updates about assignments and results.</div>
      </div>
      <div>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => { localStorage.setItem('komu_hide_realtime_banner', '1'); setVisible(false) }} aria-label="Dismiss banner">Dismiss</button>
      </div>
    </div>
  )
}
