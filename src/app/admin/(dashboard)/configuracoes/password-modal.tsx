"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { KeyRound, Loader2 } from "lucide-react"
import { updateAdminPassword } from "@/actions/admin-credentials"
import { cn } from "@/lib/utils"

export function PasswordChangeModal() {
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    try {
      // Usando Server Action diretamente não requer fetch()
      const result = await updateAdminPassword(null, formData)

      if (result.success) {
        setMessage({ type: "success", text: "Senha atualizada com sucesso!" })
        setTimeout(() => {
          setOpen(false)
          setMessage(null)
        }, 2000)
      } else {
        setMessage({ type: "error", text: result.error || "Erro ao atualizar a senha." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro inesperado de conexão." })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setMessage(null) }}>
      <DialogTrigger render={<Button type="button" className="gap-2" />}>
        <KeyRound className="h-4 w-4" />
        Alterar Senha de Acesso
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
          <DialogDescription>
            Insira sua senha atual e a nova senha que deseja utilizar para acessar o painel administrativo.
          </DialogDescription>
        </DialogHeader>

        {message && (
          <div className={cn("p-3 rounded-md text-sm", message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-destructive/10 text-destructive border border-destructive/20")}>
            {message.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input id="currentPassword" name="currentPassword" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input id="newPassword" name="newPassword" type="password" minLength={6} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" minLength={6} required />
          </div>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Nova Senha
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
