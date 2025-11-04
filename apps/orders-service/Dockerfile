# --- 1. Etapa de Construcción (Builder) ---
# Usamos una imagen de Node.js 20 para construir la app
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias de producción
# Usamos 'npm ci' para una instalación limpia y rápida
RUN npm ci

# Copiamos todo el código fuente de la aplicación
COPY . .

# Construimos la aplicación para producción
RUN npm run build

# --- 2. Etapa de Producción (Production) ---
# Usamos una imagen más ligera de Node.js 20
FROM node:20-alpine

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos solo los node_modules de producción desde la etapa 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copiamos solo la carpeta 'dist' (el código compilado) desde la etapa 'builder'
COPY --from=builder /usr/src/app/dist ./dist

# El comando por defecto para iniciar la aplicación
# (Esto ejecutará 'node dist/main.js')
CMD [ "npm", "run", "start:prod" ]