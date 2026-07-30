"use server"

import { signIn, signOut } from "../../auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function signInAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const redirectTo = formData.get("redirectTo") as string || "/admin"

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
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
  
  redirect(redirectTo)
}

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" })
}
