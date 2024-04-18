FROM node:18.20.2-buster

RUN apt-get update \
  && apt-get install -y build-essential libgl1-mesa-glx pigz \
  && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /app && chown -R node /app

USER node

WORKDIR /app

COPY --chown=node package.json /app/
COPY --chown=node package-lock.json /app/
COPY --chown=node .npm /home/node/.npm

RUN npm ci --prefer-offline --no-audit

COPY --chown=node . /app
RUN rm -rf /app/.npm

RUN rm schema.graphql \
  && npm run build

ENV NODE_ENV=production

EXPOSE 3021

CMD [ "npm", "run", "start" ]
