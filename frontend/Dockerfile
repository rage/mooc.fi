FROM node:18.16.0-buster

RUN apt-get update \
  && apt-get install -y build-essential libgl1-mesa-glx \
  && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /app && chown -R node /app
RUN corepack enable \
  && corepack prepare pnpm@latest-8 --activate \
  && pnpm config set store-dir ~/.pnpm-store
USER node

WORKDIR /app

COPY --chown=node package.json /app/
COPY --chown=node pnpm-lock.yaml /app/

RUN pnpm install --prefer-offline --frozen-lockfile

COPY --chown=node . /app

RUN rm schema.graphql \
  && pnpm build

ENV NODE_ENV=production

EXPOSE 3021

CMD [ "pnpm", "start" ]
