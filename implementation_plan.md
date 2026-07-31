# Role-Based Access Control (RBAC) e Gestão de Usuários

Este plano detalha a implementação de controle de acesso (RBAC) com dois perfis: Administrador e Colaborador, além da interface para gerenciar usuários na aba de Segurança.

## User Review Required

Nenhuma alteração estrutural no banco de dados é necessária, pois a tabela `User` já possui a coluna `role`, que atualmente possui o valor default `"admin"`.

## Proposed Changes

### `src/lib/admin-session.ts`
- Modificar o tipo `AdminSessionPayload` para que a propriedade `role` aceite tanto `"ADMIN"` quanto `"COLABORADOR"`.
- Ajustar a função de criação de sessão para repassar a role real do usuário.

### `src/actions/users.ts` [NEW]
- Criar Server Actions para gestão de usuários (`createUser`, `updateUser`, `deleteUser`, `getUsers`).
- Adicionar verificações de segurança: somente usuários com role `"ADMIN"` podem criar, editar ou excluir usuários.
- Criptografar senhas antes de salvar no banco.

### `src/app/admin/(dashboard)/configuracoes/users-management.tsx` [NEW]
- Criar um componente de interface para listar usuários cadastrados.
- Permitir a criação de novos usuários com definição de cargo (Administrador ou Colaborador).
- Permitir exclusão de usuários (com bloqueio para não excluir o próprio admin logado).

### `src/app/admin/(dashboard)/configuracoes/settings-client.tsx`
- Importar e renderizar o componente `UsersManagement` dentro da aba de Segurança.
- Mostrar a gestão de usuários apenas se o usuário logado for `"ADMIN"`.

### Proteção de Exclusão (Backend)
- `src/actions/products.ts`: Adicionar verificação de role em `deleteProductPermanent`.
- `src/actions/categories.ts`: Adicionar verificação de role em `deleteCategory`.
- `src/actions/banners.ts`: Adicionar verificação de role em `deleteBanner`.
*(Somente "ADMIN" poderá prosseguir nestas actions)*

### Proteção de Exclusão (Frontend)
- `src/app/admin/(dashboard)/produtos/page.tsx` (e `data-table.tsx`): Ocultar botões/ações de exclusão se a role for `"COLABORADOR"`.
- `src/app/admin/(dashboard)/categorias/page.tsx` (e `data-table.tsx`): Ocultar botões/ações de exclusão se a role for `"COLABORADOR"`.
- `src/app/admin/(dashboard)/banners/page.tsx`: Ocultar botões/ações de exclusão se a role for `"COLABORADOR"`.

## Verification Plan

### Manual Verification
- Fazer login como Administrador e confirmar que a aba "Segurança" exibe a gestão de usuários.
- Criar um novo usuário Colaborador.
- Fazer login com a conta do Colaborador.
- Verificar que o Colaborador **pode** criar/editar produtos, categorias e banners.
- Verificar que o Colaborador **não possui** botões de exclusão na interface.
- Tentar forçar uma chamada de exclusão para garantir que o backend bloqueie a ação.
