# Build context is the repository root (see bin/build-docker-frontend.sh): the pnpm workspace
# files and lockfile live there.
FROM node:26.13.0-bookworm

RUN apt-get update \
  && apt-get install -y build-essential libgl1 pigz \
  && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /app && chown -R node /app

COPY package.json /tmp/package.json
RUN npm install -g --no-update-notifier \
      "$(node -p 'require("/tmp/package.json").packageManager')" \
    && rm /tmp/package.json

USER node

WORKDIR /app

COPY --chown=node package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY --chown=node patches /app/patches
COPY --chown=node frontend/package.json /app/frontend/

RUN pnpm install --frozen-lockfile --filter ./frontend

COPY --chown=node frontend /app/frontend

WORKDIR /app/frontend

RUN rm schema.graphql \
  && pnpm run build

ENV NODE_ENV=production
ENV PORT=3021

EXPOSE 3021

CMD [ "node", "node_modules/next/dist/bin/next", "start" ]
