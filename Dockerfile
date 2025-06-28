FROM node:latest as builder
WORKDIR /app
ENV RUNTIME_ENVIRONMENT=node

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm run build

FROM node:latest
WORKDIR /app
ENV PUBLIC_DATA_ROOT=/app/data

COPY --from=builder /app/build ./
RUN mkdir data

ENTRYPOINT ["node", "index.js"]