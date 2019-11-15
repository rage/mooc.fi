FROM node:11-alpine

RUN apk --no-cache update \
  && apk --no-cache add g++ make bash zlib-dev libpng-dev postgresql-client redis python2 curl jq git \
  &&  rm -fr /var/cache/apk/*

COPY --chown=node . /app

USER node

WORKDIR /app

RUN npm ci \
  && mv prisma.production.yml prisma.yml \
  && npm run generate

ENV NODE_ENV=production

EXPOSE 4000
EXPOSE 7001

CMD [ "npm", "run", "start" ]
