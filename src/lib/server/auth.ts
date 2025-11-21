import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export function verifyTokenSync(token?: string) {
  if (!token) return null
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}

export function requireAuth(req: Request) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  const decoded = verifyTokenSync(token)
  if (!decoded) throw new Error('Unauthorized')
  return decoded
}
