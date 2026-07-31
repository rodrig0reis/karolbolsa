import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase()
        const password = String(credentials?.password || "").trim()
        
        console.log("[auth] tentativa:", email)

        if (!email || !password) return null

        const user = await prisma.user.findUnique({
          where: { email }
        })
        
        console.log("[auth] usuario encontrado:", !!user)
        console.log("[auth] ativo:", user?.isActive)
        console.log("[auth] role:", user?.role)

        if (!user || !user.isActive) return null

        const isValid = await bcrypt.compare(password, user.passwordHash)
        
        console.log("[auth] senha valida:", isValid)

        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { role: string }).role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" }
})
