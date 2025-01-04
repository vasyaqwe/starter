ARG BUN_IMAGE_PROD=docker.io/oven/bun:1.1.15-slim

FROM ${BUN_IMAGE_PROD} AS base

WORKDIR /app
ENV NODE_ENV="production"

COPY ./package.json ./
COPY ./tooling/typescript/package.json ./tooling/typescript/package.json
COPY ./packages/db/package.json ./packages/db/package.json
COPY ./packages/email/package.json ./packages/email/package.json
COPY ./packages/payment/package.json ./packages/payment/package.json
COPY ./packages/api/package.json ./packages/api/package.json
COPY ./packages/env/package.json ./packages/env/package.json
COPY ./apps/server/package.json ./apps/server/package.json

FROM base AS install

RUN bun install --ci

FROM base AS build

COPY --from=install ./app/node_modules ./node_modules
COPY ./tooling/typescript ./tooling/typescript
COPY ./packages/db ./packages/db
COPY ./packages/email ./packages/email
COPY ./packages/payment ./packages/payment
COPY ./packages/api ./packages/api
COPY ./packages/env ./packages/env
COPY ./apps/server ./apps/server

RUN bun run --cwd ./packages/db build && \
RUN bun run --cwd ./packages/email build && \
RUN bun run --cwd ./packages/payment build && \
    bun run --cwd ./packages/api build && \
    bun run --cwd ./packages/env build

FROM base AS start

COPY --from=build /app/packages/db ./packages/db
COPY --from=build /app/packages/email ./packages/email
COPY --from=build /app/packages/payment ./packages/payment
COPY --from=build /app/packages/api ./packages/api
COPY --from=build /app/packages/env ./packages/env
COPY --from=build /app/apps/server ./apps/server
COPY --from=install /app/node_modules ./node_modules

EXPOSE 8080
CMD [ "bun", "run", "--cwd", "/app/apps/server", "start" ]