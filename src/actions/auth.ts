"use server"

import { signIn, signOut } from "../../auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function signInAction(prevState: unknown, formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase()
  const password = String(formData.get("password") || "").trim()
  const redirectTo = String(formData.get("redirectTo") || "/admin")

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "E-mail ou senha incorretos." }
        default:
          return { error: "Ocorreu um erro ao fazer login." }
      }
    }
    throw error
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" })
}
