FROM node:12.18.4

RUN apt-get update
RUN mkdir -p /app && chown -R node /app

USER node

WORKDIR /app

COPY --chown=node package.json /app/
COPY --chown=node package-lock.json /app/

RUN npm ci

COPY --chown=node . /app

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "run", "start"]

ARG GIT_COMMIT=""
LABEL GIT_COMMIT=${GIT_COMMIT}
ENV GIT_COMMIT=${GIT_COMMIT}
