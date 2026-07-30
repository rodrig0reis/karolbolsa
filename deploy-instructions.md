# Guia de Deploy na VPS (Ubuntu)

Este guia ensina como colocar o projeto Karol Bolsas no ar usando sua VPS, acessando via `karolbolsas.manialivre.com.br`.

## 1. Pré-requisitos na VPS
Antes de rodar o projeto, instale o Docker, Docker Compose, Nginx e o Certbot.

Abra o terminal da sua VPS via SSH e rode:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx git
```

## 2. Configurar o Nginx (Proxy Reverso)
O Nginx vai receber as conexões da web (porta 80 e 443) e repassar para a nossa aplicação (porta 3000).

Crie um arquivo de configuração no Nginx:
```bash
sudo nano /etc/nginx/sites-available/karolbolsas
```
Cole o seguinte conteúdo e salve (Ctrl+O, Enter, Ctrl+X):
```nginx
server {
    listen 80;
    server_name karolbolsas.manialivre.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Ative o site e reinicie o Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/karolbolsas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 3. Configurar HTTPS (Certbot / Let's Encrypt)
Agora gere o certificado SSL gratuito:
```bash
sudo certbot --nginx -d karolbolsas.manialivre.com.br
```
*(Siga os passos na tela e escolha a opção 2 para redirecionar HTTP para HTTPS, se perguntado).*

## 4. Subir o Projeto (App + Banco)
Faça o clone do seu projeto na VPS e entre na pasta:
```bash
git clone https://github.com/rodrig0reis/karolbolsa.git
cd karolbolsa
```

Copie o `.env.production.example` para `.env` e edite com suas senhas reais:
```bash
cp .env.production.example .env
nano .env
```
*(Mude o POSTGRES_PASSWORD e coloque um AUTH_SECRET forte. Você pode gerar um secret na sua própria máquina local rodando `npx auth secret` e colando aí).*

Finalmente, rode o script de deploy:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 5. Script de Backup (Opcional)
Para garantir que suas imagens (da pasta `/public/uploads`) e seu banco de dados não sejam perdidos, você pode criar um cronjob que roda esse comando diariamente. 

Crie um script `backup.sh`:
```bash
#!/bin/bash
DATE=$(date +"%Y%m%d")
BACKUP_DIR="/var/backups/karolbolsas"
mkdir -p $BACKUP_DIR

# Backup do Banco (PostgreSQL)
docker exec karol_db_prod pg_dump -U postgres karolbolsas_prod > "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup das Imagens
tar -czf "$BACKUP_DIR/images_backup_$DATE.tar.gz" -C /caminho/do/seu/projeto/karolbolsa/public uploads

# Remove backups com mais de 7 dias
find $BACKUP_DIR -type f -mtime +7 -name '*.sql' -exec rm {} \;
find $BACKUP_DIR -type f -mtime +7 -name '*.tar.gz' -exec rm {} \;
```
