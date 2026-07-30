# Karol Bolsas

Vitrine virtual de bolsas e acessórios femininos com venda via WhatsApp.

## Stack Tecnológica
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS + Shadcn UI
- Prisma ORM + PostgreSQL
- NextAuth.js (Auth.js)

## Como rodar localmente (Desenvolvimento)

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Crie seu arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Suba o banco de dados (se usar Docker localmente) ou aponte a URL para um banco local:
   ```bash
   docker compose up -d
   ```

4. Rode as migrations e o Prisma generate:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Faça o seed do banco de dados (Isso criará o admin e produtos teste):
   ```bash
   npm run prisma:seed
   ```
   **Nota:** Em ambiente de produção, certifique-se de configurar `ADMIN_PASSWORD`, `ADMIN_EMAIL` e `ADMIN_NAME` no seu arquivo `.env.production`. Se `ADMIN_PASSWORD` estiver ausente em produção, o seed será abortado por segurança.

6. Inicie a aplicação:
   ```bash
   npm run dev
   ```

## Acessando o Painel Admin
Acesse `/admin/login`
- **Email:** (O que você configurou no `.env` em `ADMIN_EMAIL`, ou o padrão `admin@localhost`)
- **Senha:** (A que configurou em `ADMIN_PASSWORD` ou o padrão `senha_segura_123`)

No painel, é possível cadastrar novos produtos e enviar até 7 imagens (1 principal e 6 adicionais). O upload é feito localmente para a pasta `public/uploads`, restrito a JPEG/PNG/WEBP com até 5MB.

Configurações como Número do WhatsApp e Link do Instagram devem ser alteradas no `.env` e são refletidas através do seed inicial, ou pelo painel (futuramente).

## Limpeza de Cache
Se você enfrentar problemas de páginas que não atualizam por conta do cache estático agressivo do Next.js, rode:
```bash
rm -rf .next
npm run build
```

## Preparação para Deploy VPS

Siga o checklist antes de colocar o site no ar (deploy real):

1. Acesse o servidor VPS e clone o repositório.
2. Copie o `.env.production.example` para `.env.production` e preencha as chaves:
   - Defina senhas fortes para `POSTGRES_PASSWORD` e `ADMIN_PASSWORD`.
   - Gere uma string segura (32 caracteres) para `AUTH_SECRET`.
   - Configure a URL final em `NEXT_PUBLIC_SITE_URL` e `NEXTAUTH_URL`.
   - Defina o `WHATSAPP_NUMBER` no formato internacional sem símbolos (ex: `5511999999999`).
3. Dê permissão de execução aos scripts:
   ```bash
   chmod +x deploy.sh scripts/*.sh
   ```
4. Execute o deploy automatizado (Docker irá buildar a versão Standalone e aplicar o seed):
   ```bash
   ./deploy.sh
   ```
5. Configure o Nginx proxy (copie `deploy/nginx/karolbolsas.conf` para `/etc/nginx/sites-available/` e crie o link simbólico).
6. Rode o certbot:
   ```bash
   sudo certbot --nginx -d karolbolsas.manialivre.com.br
   ```
7. Configure o Cron para backup automático apontando para `scripts/backup.sh`.
