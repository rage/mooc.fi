FROM node:18.16.0-alpine3.18

RUN apk update && \
    apk add \
      build-base \
      libpng-dev \
      postgresql-client \
      libpq \
      redis \
      git \
      jq \
      bash \
      python3 \
      librdkafka=2.1.1-r0 \
      librdkafka-dev=2.1.1-r0

RUN rm -rf /var/cache/apk/*

RUN mkdir -p /app && chown -R node /app

RUN corepack enable \
  && corepack prepare pnpm@latest-8 --activate

USER node

RUN pnpm config set store-dir ~/.pnpm-store

WORKDIR /app

COPY --chown=node package.json pnpm-lock.yaml /app/
COPY --chown=node patches /app/patches
COPY --chown=node prisma /app/prisma

ARG BUILD_LIBRDKAFKA=0
RUN pnpm i --prefer-offline --frozen-lockfile

COPY --chown=node . /app

RUN cp .env.example .env \
    && cp tsconfig.production.json tsconfig.json \
    && pnpm download-env \
    && pnpm generate
RUN env NODE_ENV=production GOOGLE_CLOUD_STORAGE_BUCKET=x pnpm build
RUN pnpm build-sourcemap
RUN pnpm copy-env

ENV NODE_ENV=production

EXPOSE 4000
EXPOSE 7001

CMD [ "pnpm", "start" ]

ARG GIT_COMMIT=""
LABEL GIT_COMMIT=${GIT_COMMIT}
ENV GIT_COMMIT=${GIT_COMMIT}
