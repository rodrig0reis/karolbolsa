"use client"

import { useState, useEffect } from "react"
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
import { UserPlus, Loader2, Trash2, ShieldCheck, User } from "lucide-react"
import { createUser, getUsers, deleteUser } from "@/actions/users"
import { cn } from "@/lib/utils"

export function UsersManagement({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    const result = await getUsers()
    if (result.success && result.users) {
      setUsers(result.users)
    }
    setLoading(false)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await createUser(null, formData)
      if (result.success) {
        setMessage({ type: "success", text: result.message || "Sucesso" })
        await fetchUsers()
        setTimeout(() => {
          setOpen(false)
          setMessage(null)
        }, 1500)
      } else {
        setMessage({ type: "error", text: result.error || "Erro ao criar" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro inesperado de conexão." })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return
    
    const result = await deleteUser(id)
    if (result.success) {
      await fetchUsers()
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Equipe e Acessos</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie quem pode acessar o painel administrativo da loja.
          </p>
        </div>
        
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setMessage(null) }}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <UserPlus className="h-4 w-4" />
            Novo Usuário
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Crie um novo acesso. O <strong>Administrador</strong> tem acesso total. O <strong>Colaborador</strong> não pode excluir registros nem gerenciar usuários.
              </DialogDescription>
            </DialogHeader>

            {message && (
              <div className={cn("p-3 rounded-md text-sm", message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-destructive/10 text-destructive border border-destructive/20")}>
                {message.text}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" required placeholder="Ex: Ana Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail de Acesso</Label>
                <Input id="email" name="email" type="email" required placeholder="ana@karolbolsas.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha Temporária</Label>
                <Input id="password" name="password" type="text" required placeholder="Senha segura..." minLength={6} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Perfil de Acesso</Label>
                <select 
                  id="role" 
                  name="role" 
                  defaultValue="colaborador"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                >
                  <option value="colaborador">Colaborador (Não pode deletar)</option>
                  <option value="admin">Administrador (Acesso Total)</option>
                </select>
              </div>

              <DialogFooter className="mt-6">
                <DialogClose render={<Button type="button" variant="outline" />}>
                  Cancelar
                </DialogClose>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Usuário
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        {loading ? (
          <div className="p-8 flex justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum usuário encontrado.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">E-mail</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Perfil</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
                      u.role === "admin" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-blue-100 text-blue-800 border border-blue-200"
                    )}>
                      {u.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      {u.role === "admin" ? "Administrador" : "Colaborador"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== currentUserId && (
                      <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(u.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
