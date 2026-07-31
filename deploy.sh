#!/bin/bash
set -euo pipefail

COMPOSE="docker compose --env-file .env.production -f docker-compose.prod.yml"

echo "Iniciando atualização Karol Bolsas..."

echo "Garantindo banco online..."
$COMPOSE up -d db

echo "Rodando migrations, seed e patch..."
$COMPOSE run --rm migrate sh -c "npx prisma migrate deploy && npx prisma db seed && npm run patch:products"

echo "Construindo nova imagem web sem derrubar site atual..."
$COMPOSE build web

echo "Atualizando somente o container web..."
$COMPOSE up -d --no-deps web

echo "Status:"
$COMPOSE ps

echo "Atualização concluída."
