# ---- Stage 1: install dependencies ----
FROM node:20-alpine AS deps

WORKDIR /app


COPY package.json package-lock.json ./

RUN npm ci --omit=dev

# ---- Stage 2: runtime ----
FROM node:20-alpine AS runtime

WORKDIR /app


USER node

COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "src/server.js"]