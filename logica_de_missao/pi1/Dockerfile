FROM node:lts-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:lts-alpine AS runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next

COPY --from=builder /app/public ./public

COPY --from=builder /app/node_modules ./node_modules

COPY next.config.js ./
COPY package.json ./

EXPOSE 3000

USER node

CMD ["npm", "start"]
