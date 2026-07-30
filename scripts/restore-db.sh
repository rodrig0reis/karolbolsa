#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Uso: $0 <caminho_do_arquivo.sql.gz>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Erro: Arquivo $BACKUP_FILE não encontrado!"
  exit 1
fi

echo "Cuidado: Isso irá sobrescrever o banco de dados atual!"
read -p "Tem certeza que deseja continuar? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Descompactando e restaurando o banco de dados..."
  gunzip -c "$BACKUP_FILE" | docker compose -f /opt/karolbolsa/docker-compose.prod.yml exec -T db psql -U user -d karolbolsa
  echo "Restauração do banco concluída!"
else
  echo "Operação cancelada."
fi
