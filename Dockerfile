FROM node:22-alpine AS base
WORKDIR /app

FROM base AS builder
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PATH=/app/node_modules/.bin:$PATH

# Required for sharp (image optimization) on Alpine Linux
RUN apk add --no-cache libc6-compat

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "10001" \
    appuser

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN mkdir -p /app/.next && chown -R appuser:appuser /app

USER appuser

EXPOSE 3000
CMD ["sh", "-c", "node node_modules/.bin/prisma db push --skip-generate --accept-data-loss && node server.js"]

