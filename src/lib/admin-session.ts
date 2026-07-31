import crypto from "node:crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "karol_admin_session"

type AdminSessionPayload = {
  userId: string
  email: string
  role: "ADMIN"
  exp: number
}

function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET não configurado")
  return secret
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("hex")
}

function encode(payload: AdminSessionPayload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const signature = sign(data)
  return `${data}.${signature}`
}

function decode(token: string): AdminSessionPayload | null {
  const [data, signature] = token.split(".")

  if (!data || !signature) return null

  const expected = sign(data)

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    )
  ) {
    return null
  }

  const payload = JSON.parse(
    Buffer.from(data, "base64url").toString("utf8")
  ) as AdminSessionPayload

  if (!payload.exp || payload.exp < Date.now()) return null

  return payload
}

export async function createAdminSession(user: {
  id: string
  email: string
  role: string
}) {
  const payload: AdminSessionPayload = {
    userId: user.id,
    email: user.email,
    role: "ADMIN",
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
  }

  const token = encode(payload)

  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  try {
    return decode(token)
  } catch {
    return null
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
