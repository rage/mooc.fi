# Build context is the repository root (see bin/build-docker-frontend.sh): the pnpm workspace
# files and lockfile live there.
FROM node:26.13.0-bookworm AS build

RUN apt-get update \
  && apt-get install -y build-essential libgl1 \
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

# bin/build-docker-frontend.sh exports this stage to keep the Next build cache between CI runs.
FROM scratch AS next-cache
COPY --from=build /app/frontend/.next/cache /

# Must stay glibc-based: sharp's prebuilt libvips is installed for the build stage's libc.
FROM node:26.13.0-bookworm-slim

USER node

WORKDIR /app

COPY --from=build --chown=node /app/frontend/.next/standalone /app
COPY --from=build --chown=node /app/frontend/.next/static /app/frontend/.next/static
COPY --from=build --chown=node /app/frontend/public /app/frontend/public

WORKDIR /app/frontend

ENV NODE_ENV=production
ENV PORT=3021
# The standalone server listens on $HOSTNAME, which otherwise holds the container hostname.
ENV HOSTNAME=0.0.0.0

EXPOSE 3021

CMD [ "node", "server.js" ]
