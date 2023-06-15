FROM node:18.16.0-alpine

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
      python3

RUN wget https://github.com/edenhill/librdkafka/archive/v2.1.1.tar.gz  -O - | tar -xz \
  && cd librdkafka-2.1.1 \
  && ./configure --prefix=/usr \
  && make && make install \
  && cd ..
# when node image incorporates alpine 3.18
#  RUN apk  add \
#   librdkafka=2.1.1-r0 \
#   librdkafka-dev=2.1.1-r0
RUN rm -rf /var/cache/apk/*

RUN mkdir -p /app && chown -R node /app

RUN corepack enable \
  && corepack prepare pnpm@latest-8 --activate

USER node

RUN pnpm config set store-dir ~/.pnpm-store

WORKDIR /app

COPY --chown=node package.json /app/
COPY --chown=node pnpm-lock.yaml /app/
COPY --chown=node patches /app/patches

RUN env BUILD_LIBRDKAFKA=0 pnpm i --prefer-offline --frozen-lockfile
# when node image incorporates alpine 3.18
# RUN rm -rf /node_modules/node-rdkafka/deps

COPY --chown=node . /app

RUN cp .env.example .env \
    && cp tsconfig.production.json tsconfig.json \
    && pnpm generate \
    && env NODE_ENV=production GOOGLE_CLOUD_STORAGE_BUCKET=x pnpm build
RUN pnpm build-sourcemap
RUN pnpm copy-env

ENV NODE_ENV=production

EXPOSE 4000
EXPOSE 7001

CMD [ "pnpm", "start" ]

ARG GIT_COMMIT=""
LABEL GIT_COMMIT=${GIT_COMMIT}
ENV GIT_COMMIT=${GIT_COMMIT}
