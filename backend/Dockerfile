FROM node:14

RUN apt-get update \
  && apt-get install -yy build-essential libpng-dev postgresql-client libpq-dev redis-tools git jq \
  && rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/edenhill/librdkafka/archive/v1.5.3.tar.gz  -O - | tar -xz \
  && cd librdkafka-1.5.3 \
  && ./configure --prefix=/usr \
  && make && make install \
  && cd ..

RUN mkdir -p /app && chown -R node /app

USER node

WORKDIR /app

COPY --chown=node package.json /app/
COPY --chown=node package-lock.json /app/

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
