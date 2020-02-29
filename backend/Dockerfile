FROM node:12

RUN apt-get update \
  && apt-get install -yy build-essential libpng-dev postgresql-client libpq-dev redis-tools git jq \
  && rm -rf /var/lib/apt/lists/*

COPY --chown=node . /app

USER node

WORKDIR /app

RUN npm ci \
  && mv prisma.production.yml prisma.yml \
  && npm run generate \
  && npm run generate-nexus

ENV NODE_ENV=production

EXPOSE 4000
EXPOSE 7001

CMD [ "npm", "run", "start" ]
