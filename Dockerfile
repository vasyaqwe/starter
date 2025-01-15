FROM oven/bun:1.1.15-slim

ENV NODE_ENV="production"

WORKDIR /app

COPY package.json .
COPY turbo.json .
COPY tooling/typescript/package.json tooling/typescript/
COPY packages/api/package.json packages/api/
COPY packages/db/package.json packages/db/
COPY packages/email/package.json packages/email/
COPY packages/env/package.json packages/env/
COPY packages/payment/package.json packages/payment/
COPY packages/shared/package.json packages/shared/
COPY apps/server/package.json apps/server/

RUN bun install --production && bun install turbo@^2.3.3 -g

COPY tooling/typescript tooling/typescript
COPY packages/ packages/
COPY apps/server apps/server

RUN bun run turbo build

EXPOSE 8080
CMD [ "bun", "run", "--cwd", "/app/apps/server", "start" ]