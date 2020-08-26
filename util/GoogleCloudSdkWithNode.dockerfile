FROM google/cloud-sdk

RUN apt-get update && apt-get install -yy nodejs
RUN npm i -g npx
