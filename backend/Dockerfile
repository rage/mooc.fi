# Build context is the repository root (see bin/build-docker-backend.sh): the pnpm workspace
# files and lockfile live there.
FROM node:26.13.0-alpine AS build

# node-rdkafka compiles librdkafka from source; its configure script needs bash.
RUN apk add --no-cache \
      bash \
      build-base \
      cyrus-sasl-dev \
      linux-headers \
      openssl-dev \
      python3 \
      zlib-dev \
      zstd-dev

RUN mkdir -p /app && chown -R node /app

COPY package.json /tmp/package.json
RUN npm install -g --no-update-notifier \
      "$(node -p 'require("/tmp/package.json").packageManager')" \
    && rm /tmp/package.json

USER node

WORKDIR /app

COPY --chown=node package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY --chown=node patches /app/patches
COPY --chown=node backend/package.json /app/backend/
COPY --chown=node backend/prisma /app/backend/prisma

RUN pnpm install --frozen-lockfile --filter ./backend

COPY --chown=node backend /app/backend

WORKDIR /app/backend

RUN cp .env.example .env \
    && cp tsconfig.production.json tsconfig.json \
    && pnpm run generate \
    && env NODE_ENV=production GOOGLE_CLOUD_STORAGE_BUCKET=x pnpm run build
RUN pnpm run build-sourcemap

# A --prod install over the full one unlinks devDependencies but leaves them in node_modules/.pnpm.
RUN cd /app \
    && rm -rf node_modules backend/node_modules \
    && pnpm install --frozen-lockfile --offline --prod --filter ./backend

# Only the addon and the librdkafka shared libraries it loads via rpath are needed at runtime;
# the rest is librdkafka's source and object files.
RUN cd /app/node_modules/.pnpm/node-rdkafka@*/node_modules/node-rdkafka \
    && rm -rf deps build/Release/obj.target build/Release/.deps \
    && find build/deps -mindepth 1 -maxdepth 1 ! -name 'librdkafka*.so*' -exec rm -rf {} +

FROM node:26.13.0-alpine

# Shared libraries librdkafka links against.
RUN apk add --no-cache libsasl zstd-libs

USER node

WORKDIR /app/backend

COPY --from=build --chown=node /app/node_modules /app/node_modules
COPY --from=build --chown=node /app/backend /app/backend

ENV NODE_ENV=production

EXPOSE 4000
EXPOSE 7001

CMD [ "node", "dist/app.js" ]

ARG GIT_COMMIT=""
LABEL GIT_COMMIT=${GIT_COMMIT}
ENV GIT_COMMIT=${GIT_COMMIT}
