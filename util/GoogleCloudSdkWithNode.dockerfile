FROM google/cloud-sdk

RUN apt-get update
RUN curl -o nodejs.deb https://deb.nodesource.com/node_16.x/pool/main/n/nodejs/nodejs_16.16.0-deb-1nodesource1_amd64.deb
RUN apt-get -yy install ./nodejs.deb && rm -rf /var/lib/apt/lists/*
RUN npm i -g npm
RUN npm install -g @sentry/cli --unsafe-perm
