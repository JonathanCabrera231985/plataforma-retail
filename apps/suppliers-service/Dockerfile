# --- 1. Etapa de Construcción (Builder) ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiamos archivos de dependencias y TSConfig del monorepo
COPY package*.json tsconfig.json ./
COPY apps/common ./apps/common
COPY apps/suppliers-service/package*.json ./apps/suppliers-service/

# Instalamos dependencias limpiamente
RUN npm ci

# Compilamos la librería compartida
RUN npm run build --workspace=apps/common

# Copiamos el resto de código del microservicio y compilamos
COPY apps/suppliers-service ./apps/suppliers-service
RUN npm run build --workspace=apps/suppliers-service

# --- 2. Etapa de Producción (Production) ---
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiamos dependencias y distribuciones
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/common/dist ./apps/common/dist
COPY --from=builder /usr/src/app/apps/suppliers-service/dist ./apps/suppliers-service/dist
COPY --from=builder /usr/src/app/apps/suppliers-service/package.json ./apps/suppliers-service/package.json

CMD [ "node", "apps/suppliers-service/dist/main.js" ]