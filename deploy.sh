#!/bin/bash
set -euo pipefail

echo "Iniciando processo de deploy..."

echo "Fazendo build e subindo banco de dados..."
docker compose -f docker-compose.prod.yml up -d db

echo "Executando migrations..."
docker compose -f docker-compose.prod.yml run --rm migrate

echo "Subindo aplicação web..."
docker compose -f docker-compose.prod.yml up -d --build web

echo "Removendo imagens antigas sem uso..."
docker image prune -f

echo "Deploy concluído com sucesso!"
