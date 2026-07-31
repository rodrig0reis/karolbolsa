"use client"

import { useActionState } from "react"
import { signInAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginForm() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/admin"
  
  const [state, formAction, isPending] = useActionState(signInAction, null)

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-serif text-primary">Karol Bolsas</CardTitle>
          <CardDescription>
            Faça login para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <input type="hidden" name="redirectTo" value={from} />
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@karolbolsas.com.br"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            {state?.error && (
              <div className="text-sm text-destructive text-center font-medium">
                {state.error}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export function LoginClient() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-muted/30">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
