#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Uso: $0 <caminho_do_arquivo.tar.gz>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Erro: Arquivo $BACKUP_FILE não encontrado!"
  exit 1
fi

echo "Cuidado: Isso irá sobrescrever a pasta de uploads atual!"
read -p "Tem certeza que deseja continuar? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Limpando uploads atuais e restaurando do backup..."
  # Usar caminho absoluto no path host para extração
  docker run --rm -v karolbolsa_karol_uploads:/app/public/uploads -v "$(dirname $(realpath $BACKUP_FILE))":/backup alpine sh -c "rm -rf /app/public/uploads/* && tar xzf /backup/$(basename $BACKUP_FILE) -C /app/public/"
  echo "Restauração de uploads concluída!"
else
  echo "Operação cancelada."
fi
