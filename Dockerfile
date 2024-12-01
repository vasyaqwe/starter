ARG BUN_IMAGE_PROD=docker.io/oven/bun:1.1.13-slim

FROM ${BUN_IMAGE_PROD} AS base

WORKDIR /app
ENV NODE_ENV="production"

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

FROM base as install

COPY ./package.json ./
COPY ./tooling/typescript/package.json ./tooling/typescript/package.json
COPY ./packages/db/package.json ./packages/db/package.json
COPY ./packages/api/package.json ./packages/api/package.json
COPY ./packages/env/package.json ./packages/env/package.json
COPY ./apps/server/package.json ./apps/server/package.json
RUN bun install --production

FROM base AS build

COPY --from=install ./node_modules ./node_modules
COPY ./packages ./packages

RUN bun run --cwd ./packages/db build && \
    bun run --cwd ./packages/api build && \
    bun run --cwd ./packages/env build

FROM base AS start

COPY --from=build /app/packages/db ./packages/db
COPY --from=build /app/packages/api ./packages/api
COPY --from=build /app/packages/env ./packages/env
COPY --from=install /app/node_modules ./node_modules

EXPOSE 3000
CMD [ "bun", "run", "--cwd", "/app/apps/server", "start" ]