#!/bin/bash
set -e

# Configurações
BACKUP_DIR="/opt/backups/karol-bolsas"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=15

# Criar diretórios se não existirem
mkdir -p "$BACKUP_DIR/db"
mkdir -p "$BACKUP_DIR/uploads"

echo "Iniciando backup em $DATE..."

# Backup do Banco de Dados
echo "Realizando dump do PostgreSQL..."
docker compose -f /opt/karolbolsa/docker-compose.prod.yml exec -T db pg_dump -U user karolbolsa > "$BACKUP_DIR/db/karolbolsa_$DATE.sql"
gzip "$BACKUP_DIR/db/karolbolsa_$DATE.sql"

# Backup de Uploads (acessando volume via container temporário ou diretamente no path do host se conhecido, usaremos container)
echo "Arquivando uploads..."
docker run --rm -v karolbolsa_karol_uploads:/app/public/uploads -v "$BACKUP_DIR/uploads":/backup alpine tar czf /backup/uploads_$DATE.tar.gz -C /app/public uploads

# Limpeza de backups antigos
echo "Limpando backups com mais de $RETENTION_DAYS dias..."
find "$BACKUP_DIR/db" -name "karolbolsa_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR/uploads" -name "uploads_*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete

echo "Backup concluído com sucesso!"
