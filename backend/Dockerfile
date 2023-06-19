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
      pigz \
      librdkafka=2.1.1-r0 \
      librdkafka-dev=2.1.1-r0

RUN rm -rf /var/cache/apk/*

RUN mkdir -p /app && chown -R node /app

USER node

WORKDIR /app

COPY --chown=node package.json package-lock.json /app/
COPY --chown=node patches /app/patches
COPY --chown=node prisma /app/prisma

ARG BUILD_LIBRDKAFKA=0
RUN npm ci --prefer-offline --no-audit
RUN rm -rf /node_modules/node-rdkafka/deps

COPY --chown=node . /app

RUN cp .env.example .env \
    && cp tsconfig.production.json tsconfig.json \
    && npm run download-env \
    && npm run generate \
    && env NODE_ENV=production GOOGLE_CLOUD_STORAGE_BUCKET=x npm run build
RUN npm run build-sourcemap
RUN npm run copy-env 

ENV NODE_ENV=production

EXPOSE 4000
EXPOSE 7001

CMD [ "npm", "run", "start" ]

ARG GIT_COMMIT=""
LABEL GIT_COMMIT=${GIT_COMMIT}
ENV GIT_COMMIT=${GIT_COMMIT}
