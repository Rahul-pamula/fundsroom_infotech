FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY tsconfig.json tsconfig.build.json eslint.config.js vitest.config.ts ./
COPY src ./src
RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY src ./src
EXPOSE 5000
CMD ["node", "dist/server.js"]
