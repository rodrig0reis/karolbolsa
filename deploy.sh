#!/bin/bash

echo "🚀 Iniciando deploy da Karol Bolsas..."

# 1. Puxar as últimas alterações do GitHub (presumindo que o repositório já está clonado)
git pull origin main

# 2. Subir os containers (Build e recria os que mudaram)
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Aguardar o banco de dados iniciar
echo "⏳ Aguardando banco de dados iniciar..."
sleep 5

# 4. Rodar as migrations do Prisma no container web
echo "🔄 Rodando migrations..."
docker exec -it karol_web_prod npx prisma migrate deploy

# (Opcional) Seed - Descomente na primeira vez que rodar para criar o usuário admin
# docker exec -it karol_web_prod npm run seed

echo "✅ Deploy finalizado com sucesso! O sistema está rodando na porta 3000."
