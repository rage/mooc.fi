## Development environment

Note: Before starting development, please run the following command on the repo root:

```bash
npm ci
```

frontend:

```bash
cd frontend
npm ci
npm run dev
```

backend:

```bash
cd backend
docker-compose up
```

```bash
cd backend
npm ci
npm run migrate
npm run dev
```

## Using installed `librdkafka` to speed up backend development

By default, `node-rdkafka` builds `librdkafka` from the source. This can take minutes on a bad day and can slow development down quite considerably. However, there's an option to use the version installed locally.

Do this in some other directory than the project one:

```bash
wget https://github.com/edenhill/librdkafka/archive/v1.4.0.tar.gz
cd librdkafka-1.4.0
./configure --prefix=/usr
make && make install
```

You may have to do some of that as root. Alternatively, you can install a prebuilt package - see [here](https://github.com/edenhill/librdkafka) for more information. Just be sure to install version >1.4.0.

Set the env `BUILD_LIBRDKAFKA=0` when doing `npm ci` or similar on the backend to skip the build.

## Documentation

[Kafka](backend/docs/kafka.md)
