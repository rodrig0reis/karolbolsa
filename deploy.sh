#!/bin/bash
set -euo pipefail

COMPOSE="docker compose --env-file .env.production -f docker-compose.prod.yml"

echo "Iniciando deploy Karol Bolsas..."

echo "Parando containers antigos..."
$COMPOSE down

echo "Subindo banco..."
$COMPOSE up -d db

echo "Aguardando banco iniciar..."
sleep 15

echo "Rodando migrations e seed..."
$COMPOSE run --rm migrate sh -c "npx prisma migrate deploy && npx prisma db seed"

echo "Aplicando patch de produtos..."
$COMPOSE run --rm migrate sh -c "npm run patch:products"

echo "Subindo aplicação web..."
$COMPOSE up -d --build web

echo "Status dos containers:"
$COMPOSE ps

echo "Deploy finalizado."
