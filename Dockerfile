FROM oven/bun:1 as builder
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY --from=builder /app/build ./
RUN bun install
RUN mkdir data

ENTRYPOINT ["bun", "start"]