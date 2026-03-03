FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# For Lambda container images, use AWS base: public.ecr.aws/lambda/nodejs:20
# and set CMD to your handler (e.g. "handler.handler")
CMD ["node", "dist/handler.js"]
