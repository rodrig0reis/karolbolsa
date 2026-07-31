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

## Manutenção e Atualização

Atualização normal:
```bash
cd /opt/karolbolsa
git pull origin main
./deploy.sh
sudo systemctl reload nginx
```

Parada total somente em manutenção:
```bash
./scripts/stop.sh
```

Resetar senha do Admin (em caso de perda/erro):
Caso precise forçar a redefinição da senha do administrador usando as credenciais do seu arquivo `.env.production`:
```bash
chmod +x scripts/reset-admin.sh
./scripts/reset-admin.sh
```

## Deploy limpo em nova VPS Ubuntu

1. Instale as dependências básicas:
   ```bash
   sudo apt update
   sudo apt install -y ca-certificates curl gnupg git nginx certbot python3-certbot-nginx
   ```
   *Instale também o Docker Engine e o Docker Compose Plugin.*

2. Clone o repositório:
   ```bash
   sudo mkdir -p /opt/karolbolsa
   sudo chown -R $USER:$USER /opt/karolbolsa
   cd /opt/karolbolsa
   git clone URL_DO_REPOSITORIO .
   ```

3. Crie e preencha o arquivo `.env.production`:
   ```env
   DATABASE_URL=postgresql://karol_user:SENHA_FORTE@db:5432/karolbolsa?schema=public
   POSTGRES_USER=karol_user
   POSTGRES_PASSWORD=SENHA_FORTE
   POSTGRES_DB=karolbolsa
   
   AUTH_SECRET=GERAR_COM_OPENSSL
   AUTH_URL=https://karolbolsas.manialivre.com.br
   NEXTAUTH_URL=https://karolbolsas.manialivre.com.br
   AUTH_TRUST_HOST=true
   
   ADMIN_NAME=Admin
   ADMIN_EMAIL=email_admin
   ADMIN_PASSWORD=senha_admin_forte
   
   WHATSAPP_NUMBER=55DDDNUMERO
   INSTAGRAM_URL=https://www.instagram.com/karolbolsas_artesanais/
   NEXT_PUBLIC_SITE_URL=https://karolbolsas.manialivre.com.br
   UPLOAD_MAX_SIZE_MB=5
   NODE_ENV=production
   ```
   > **Nota:** Para o `AUTH_SECRET`, rode `openssl rand -base64 32`. Se a senha do banco (`POSTGRES_PASSWORD`) contiver `@`, codifique na `DATABASE_URL` ou use senhas alfanuméricas.

4. Dê permissão e execute o deploy:
   ```bash
   cp .env.production .env
   chmod +x deploy.sh
   chmod +x scripts/backup.sh
   chmod +x scripts/restore-db.sh
   chmod +x scripts/restore-uploads.sh
   ./deploy.sh
   ```

5. Valide o funcionamento:
   ```bash
   docker compose --env-file .env.production -f docker-compose.prod.yml ps
   docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=100 web
   docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=80 db
   ```

6. Configure o Nginx proxy:
   ```bash
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo cp deploy/nginx/karolbolsas.conf /etc/nginx/sites-available/karolbolsas.conf
   sudo ln -sf /etc/nginx/sites-available/karolbolsas.conf /etc/nginx/sites-enabled/karolbolsas.conf
   sudo nginx -t
   sudo systemctl reload nginx
   ```
   *Teste HTTP:* `curl -I http://karolbolsas.manialivre.com.br`

7. Emitir HTTPS (Certbot):
   ```bash
   sudo certbot --nginx -d karolbolsas.manialivre.com.br
   sudo certbot renew --dry-run
   ```

## Segurança (Checklist Obrigatório)
- Nunca commite o arquivo `.env.production`.
- Troque `POSTGRES_PASSWORD`, `ADMIN_PASSWORD` e `AUTH_SECRET` se forem vazados.
- Não use senhas com caracteres especiais sem formatar (URL encode) na `DATABASE_URL`.
- Não exponha o banco PostgreSQL publicamente (porta 5432). O `docker-compose.prod.yml` usa network interna.
- Mantenha a aplicação Web mapeada somente no localhost (`127.0.0.1:3000`). O acesso externo deve ser intermediado estritamente via proxy reverso (Nginx).

## Testando o Preview do WhatsApp

O site está configurado com as tags Open Graph para gerar um preview bonito quando o link é compartilhado no WhatsApp, Telegram, Twitter e outros.
Para verificar se o WhatsApp já atualizou a imagem de capa (logo):
1. Copie a URL `https://karolbolsas.manialivre.com.br/`
2. Cole em uma conversa no WhatsApp e aguarde alguns segundos antes de enviar.
3. A imagem `og-karol-bolsas.jpg` deverá aparecer.

Se não atualizar de imediato, pode ser cache dos servidores do Facebook/WhatsApp. Tente enviar a URL com um parâmetro aleatório, como `https://karolbolsas.manialivre.com.br/?v=1` para forçar o WhatsApp a ler novamente as tags `<meta property="og:image" ...>`.
