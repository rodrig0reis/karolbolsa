# 1. Base image
FROM node:20-alpine AS base

# 2. Dependencies
FROM base AS deps
WORKDIR /app
# Install dependencies needed for node-gyp and prisma
RUN apk add --no-cache libc6-compat python3 make g++ openssl
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1

# Run Prisma generate explicitly inside the builder
RUN npx prisma generate

RUN npm run build

# 4. Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Instalar dependências necessárias para o Prisma e OpenSSL em runtime
RUN apk add --no-cache openssl ca-certificates

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permissions for the uploads directory
RUN mkdir -p public/uploads
RUN chown -R nextjs:nodejs public

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# O Prisma precisa das migrations e de rodar em prod. 
# Podemos fazer o migrate no script de entrypoint ou manualmente, mas o Next.js já sobe no server.js
CMD ["node", "server.js"]
