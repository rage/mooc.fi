FROM node:18.16.0-alpine

RUN apk update && \
    apk add --no-cache build-base libpng-dev postgresql-client libpq redis git jq bash python3

RUN wget https://github.com/edenhill/librdkafka/archive/v2.0.2.tar.gz  -O - | tar -xz \
  && cd librdkafka-2.0.2 \
  && ./configure --prefix=/usr \
  && make && make install \
  && cd ..

RUN mkdir -p /app && chown -R node /app

USER node

WORKDIR /app

COPY --chown=node package.json /app/
COPY --chown=node package-lock.json /app/
COPY --chown=node patches /app/patches

RUN env BUILD_LIBRDKAFKA=0 npm ci

COPY --chown=node . /app

RUN cp .env.example .env \
    && cp tsconfig.production.json tsconfig.json \
    && npm run download-env \
    && npm run generate \
    && env NODE_ENV=production GOOGLE_CLOUD_STORAGE_BUCKET=x npm run build
RUN npm run build-sourcemap
#    && cp -R sourcemap/bin dist/bin \
#    && rm .env
RUN npm run copy-env 

ENV NODE_ENV=production

EXPOSE 4000
EXPOSE 7001

CMD [ "npm", "run", "start" ]

ARG GIT_COMMIT=""
LABEL GIT_COMMIT=${GIT_COMMIT}
ENV GIT_COMMIT=${GIT_COMMIT}
