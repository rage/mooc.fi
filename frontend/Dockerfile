FROM node:11-alpine

RUN apk --no-cache update \
  && apk --no-cache add g++ make bash zlib-dev curl \
  &&  rm -fr /var/cache/apk/*

COPY --chown=node . /app

USER node

WORKDIR /app

RUN npm ci \
  && npm run build

ENV NODE_ENV=production

EXPOSE 3021

CMD [ "npm", "run", "start" ]
