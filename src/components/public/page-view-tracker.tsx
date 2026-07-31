"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Não executa no lado do servidor
    if (typeof window === "undefined") return
    if (!pathname) return

    // Ignora rotas de admin no client também por segurança extra
    if (pathname.startsWith("/admin")) return

    // Evita spam recarregando a mesma rota na mesma aba
    const key = `pageview:${pathname}`
    if (sessionStorage.getItem(key)) {
      return
    }

    const trackView = async () => {
      try {
        let deviceType = "desktop"
        const ua = navigator.userAgent.toLowerCase()
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
          deviceType = "tablet"
        } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
          deviceType = "mobile"
        }

        await fetch("/api/track/pageview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
            fullUrl: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            deviceType,
          }),
        })

        // Marca como registrado para não duplicar na mesma sessão
        sessionStorage.setItem(key, "true")
      } catch (err) {
        console.error("Failed to track view", err)
      }
    }

    // Usar timeout para não bloquear renderização inicial (opcional)
    const timeoutId = setTimeout(() => {
      trackView()
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [pathname])

  return null
}
