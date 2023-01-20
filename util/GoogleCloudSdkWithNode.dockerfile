FROM google/cloud-sdk

RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -yy nodejs && rm -rf /var/lib/apt/lists/*
RUN npm i -g npm
RUN npm install -g @sentry/cli --unsafe-perm
