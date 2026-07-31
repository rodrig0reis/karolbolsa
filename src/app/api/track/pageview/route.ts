import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { path, fullUrl, referrer, userAgent, deviceType } = body

    if (!path) {
      return NextResponse.json({ ok: false, error: "Missing path" }, { status: 400 })
    }

    // Ignorar rotas de admin
    if (path.startsWith("/admin")) {
      return NextResponse.json({ ok: true, ignored: true })
    }

    // Capturar IPs (tentativa via headers comuns em VPS/Proxies)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    
    const secret = process.env.AUTH_SECRET || "fallback_secret_key_if_missing"

    // Criar Hashes anonimizados para evitar armazenar IPs e PIIs no banco de forma reversível
    const ipHash = crypto.createHmac("sha256", secret).update(ip).digest("hex")
    const visitorHash = crypto.createHmac("sha256", secret).update(`${ip}-${userAgent || "unknown"}`).digest("hex")

    await prisma.pageView.create({
      data: {
        path,
        fullUrl,
        referrer,
        userAgent,
        deviceType,
        ipHash,
        visitorHash
      }
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    // Se falhar silenciosamente para não quebrar site
    console.error("Failed to track page view:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
