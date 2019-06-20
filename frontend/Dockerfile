FROM node:12

RUN apt-get update \
  && apt-get install -y build-essential libgl1-mesa-glx \
  && rm -rf /var/lib/apt/lists/*

COPY --chown=node . /app

USER node

WORKDIR /app

RUN npm ci \
  && npm run build

ENV NODE_ENV=production

EXPOSE 3021

CMD [ "npm", "run", "start" ]
