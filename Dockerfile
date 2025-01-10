ARG BUN_IMAGE_PROD=docker.io/oven/bun:1.1.15-slim

FROM ${BUN_IMAGE_PROD} AS base

WORKDIR /app
ENV NODE_ENV="production"

COPY ./package.json ./
COPY ./tooling/typescript/package.json ./tooling/typescript/package.json
COPY ./packages/api/package.json ./packages/api/package.json
COPY ./packages/db/package.json ./packages/db/package.json
COPY ./packages/email/package.json ./packages/email/package.json
COPY ./packages/env/package.json ./packages/env/package.json
COPY ./packages/payment/package.json ./packages/payment/package.json
COPY ./packages/shared/package.json ./packages/shared/package.json
COPY ./apps/server/package.json ./apps/server/package.json

FROM base AS install
RUN bun install --ci

FROM base AS build
COPY --from=install ./app/node_modules ./node_modules
COPY ./tooling/typescript ./tooling/typescript
COPY ./packages/ ./packages/
COPY ./apps/server ./apps/server

RUN cd packages && \
    for pkg in api db email env payment shared; do \
        bun run --cwd ./$pkg build; \
    done

FROM base AS start

COPY --from=build /app/packages/ ./packages/
COPY --from=build /app/apps/server ./apps/server
COPY --from=install /app/node_modules ./node_modules

EXPOSE 8080
CMD [ "bun", "run", "--cwd", "/app/apps/server", "start" ]