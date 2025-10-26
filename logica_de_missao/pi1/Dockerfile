# Dockerfile para Ambiente de Produção (npm start)
# Utiliza Multi-Stage Build para criar uma imagem runtime mínima e segura.

# === STAGE 1: builder (Construção) ===
FROM node:18-alpine AS builder
WORKDIR /app

# Instalação de dependências (todas para o build)
COPY package*.json ./
RUN npm ci

# Copia o código e constrói a aplicação Next.js
COPY . .
RUN npm run build

# === STAGE 2: runtime (Imagem final e leve) ===
FROM node:18-alpine AS runtime
WORKDIR /app

# Apenas dependências de produção são instaladas na imagem final
COPY package*.json ./
RUN npm ci --only=production

# Copia artefatos construídos
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Copia arquivos de runtime (ex: next.config.js, package.json)
COPY next.config.js ./
COPY package.json ./

EXPOSE 3000

# Boa prática: Rodar como usuário não-root (node)
USER node

# Comando de produção para servir o build
CMD ["npm", "start"]
