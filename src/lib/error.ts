'use client'

export function getErrorMessage(err: unknown): string {
  if (!err && err !== 0) return String(err)
  if (typeof err === 'string') return err
  if (err instanceof Error) return err.message
  try {
    if (typeof err === 'object' && err !== null && 'message' in (err as any)) return (err as any).message || String(err)
  } catch (e) {
    // fallthrough
  }
  return String(err)
}
