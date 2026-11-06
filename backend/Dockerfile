# Build context is the repository root (see bin/build-docker-backend.sh): the pnpm workspace
# files and lockfile live there.
FROM node:26.13.0-alpine

RUN apk add --no-cache \
      build-base \
      bash \
      cyrus-sasl-dev \
      git \
      jq \
      libpng-dev \
      libpq \
      linux-headers \
      openssl-dev \
      pigz \
      postgresql-client \
      python3 \
      redis \
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
    && pnpm run download-env \
    && pnpm run generate \
    && env NODE_ENV=production GOOGLE_CLOUD_STORAGE_BUCKET=x pnpm run build
RUN pnpm run build-sourcemap
RUN pnpm run copy-env

ENV NODE_ENV=production

EXPOSE 4000
EXPOSE 7001

CMD [ "node", "dist/app.js" ]

ARG GIT_COMMIT=""
LABEL GIT_COMMIT=${GIT_COMMIT}
ENV GIT_COMMIT=${GIT_COMMIT}
