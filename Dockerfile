ARG BUN_IMAGE_PROD=docker.io/oven/bun:1.1.15-slim

FROM ${BUN_IMAGE_PROD} AS base

WORKDIR /app
ENV NODE_ENV="production"

COPY ./package.json .
COPY ./**/package.json ./

FROM base AS install
RUN bun install --ci

FROM base AS build
COPY --from=install ./app/node_modules ./node_modules
COPY . .

RUN cd packages && \
    for pkg in api db email env payment shared; do \
        bun run --cwd ./$pkg build; \
    done

FROM base AS start
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/server ./apps/server
COPY --from=install /app/node_modules ./node_modules

EXPOSE 8080
CMD [ "bun", "run", "--cwd", "/app/apps/server", "start" ]