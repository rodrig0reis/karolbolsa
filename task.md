# Gestão de Usuários e RBAC

- [x] 1. Ajustar `AdminSessionPayload` em `src/lib/admin-session.ts` para suportar role dinâmica (`"ADMIN" | "COLABORADOR"`).
- [x] 2. Ajustar `src/api/admin/login/route.ts` para repassar a role correta do banco.
- [x] 3. Criar `src/actions/users.ts` para operações de CRUD de usuários.
- [x] 4. Criar UI `users-management.tsx` e integrá-la na aba de segurança em `settings-client.tsx`.
- [x] 5. Proteger rotas de exclusão (backend) verificando `session.role === "ADMIN"`.
  - [x] 5.1 `deleteProductPermanent` em `src/actions/products.ts`.
  - [x] 5.2 `deleteCategory` em `src/actions/categories.ts`.
  - [x] 5.3 `deleteBanner` em `src/actions/banners.ts`. (N/A - Não existe)
- [x] 6. Ocultar botões de exclusão na UI para o Colaborador.
  - [x] 6.1 Tabela de produtos (`src/components/admin/data-table.tsx` ou afins). (N/A - Sem botão na UI)
  - [x] 6.2 Tabela de categorias.
  - [x] 6.3 Tabela de banners. (N/A - Não existe)
