import KOMU_CONFIG from '@/config/komu.config'

const OVERRIDE_PREFIX = 'komu_feature_'

export function getOverrides(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  const out: Record<string, boolean> = {}
  Object.keys(KOMU_CONFIG.features).forEach((k) => {
    const v = localStorage.getItem(OVERRIDE_PREFIX + k)
    if (v !== null) out[k] = v === '1'
  })
  return out
}

export function getFlags(): Record<string, boolean> {
  const flags: Record<string, boolean> = { ...KOMU_CONFIG.features }
  const overrides = getOverrides()
  return { ...flags, ...overrides }
}

export function setFlag(name: string, value: boolean) {
  if (typeof window === 'undefined') return
  localStorage.setItem(OVERRIDE_PREFIX + name, value ? '1' : '0')
  // emit event so other tabs/components can react
  window.dispatchEvent(new CustomEvent('komu:features:changed', { detail: { name, value } }))
}

export function clearFlag(name: string) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(OVERRIDE_PREFIX + name)
  window.dispatchEvent(new CustomEvent('komu:features:changed', { detail: { name, value: null } }))
}
