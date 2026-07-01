# --- 1. Etapa de Construcción (Builder) ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiamos archivos de dependencias y TSConfig del monorepo
COPY package*.json tsconfig.json ./
COPY apps/common ./apps/common
COPY apps/iam-service/package*.json ./apps/iam-service/

# Instalamos dependencias limpiamente
RUN npm ci

# Compilamos la librería compartida
RUN npm run build --workspace=apps/common

# Copiamos el resto de código del microservicio y compilamos
COPY apps/iam-service ./apps/iam-service
RUN npm run build --workspace=apps/iam-service

# --- 2. Etapa de Producción (Production) ---
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiamos dependencias y distribuciones
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/common/dist ./apps/common/dist
COPY --from=builder /usr/src/app/apps/iam-service/dist ./apps/iam-service/dist
COPY --from=builder /usr/src/app/apps/iam-service/package.json ./apps/iam-service/package.json

CMD [ "node", "apps/iam-service/dist/main.js" ]