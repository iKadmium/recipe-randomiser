FROM node:latest as builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm run build

FROM node:latest
WORKDIR /app
COPY --from=builder /app/build ./
RUN pnpm install
RUN mkdir data

ENV RUNTIME_ENVIRONMENT=node
ENV PUBLIC_DATA_ROOT=/app/data

ENTRYPOINT ["bun", "start"]