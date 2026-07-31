#!/bin/bash
set -euo pipefail

COMPOSE="docker compose --env-file .env.production -f docker-compose.prod.yml"

echo "Reseting admin password based on .env.production..."

$COMPOSE run --rm migrate sh -lc 'cat > /app/reset-admin.ts <<'"'"'TS'"'"'
import bcrypt from "bcryptjs";
import { prisma } from "/app/src/lib/prisma";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL ou ADMIN_PASSWORD não definido no .env.production");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await prisma.user.updateMany({
    where: { email },
    data: { 
      passwordHash,
      role: "ADMIN",
      isActive: true
    },
  });

  console.log("Admin atualizado:", email);
  console.log("Registros alterados:", result.count);

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
TS

npx tsx /app/reset-admin.ts'

echo "Reset completed."
