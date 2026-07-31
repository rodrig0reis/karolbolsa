import { cookies } from "next/headers"
import crypto from "crypto"

const SECRET = process.env.AUTH_SECRET || "default_fallback_secret_only_for_dev"
const COOKIE_NAME = "karol_admin_session"
const MAX_AGE = 60 * 60 * 24 * 30 // 30 dias

export type AdminSession = {
  userId: string
  email: string
  role: "ADMIN"
  exp: number
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex")
}

export async function createAdminSession(user: { id: string; email: string; role: string }) {
  const session: AdminSession = {
    userId: user.id,
    email: user.email,
    role: "ADMIN",
    exp: Date.now() + MAX_AGE * 1000
  }
  
  const payloadStr = JSON.stringify(session)
  const signature = sign(payloadStr)
  
  const cookieValue = `${Buffer.from(payloadStr).toString('base64')}.${signature}`

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE
  })
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(COOKIE_NAME)?.value

  if (!cookieValue) return null

  const [payloadB64, signature] = cookieValue.split('.')
  
  if (!payloadB64 || !signature) return null

  const payloadStr = Buffer.from(payloadB64, 'base64').toString('utf-8')
  
  const expectedSignature = sign(payloadStr)
  
  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    try {
      const session = JSON.parse(payloadStr) as AdminSession
      if (session.exp > Date.now() && session.role === "ADMIN") {
        return session
      }
    } catch (e) {
      return null
    }
  }
  
  return null
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
