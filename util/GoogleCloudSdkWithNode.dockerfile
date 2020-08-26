FROM google/cloud-sdk

RUN apt-get update && apt-get install -yy nodejs && rm -rf /var/lib/apt/lists/*
