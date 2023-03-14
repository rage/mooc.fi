# Development environment

## Requirements

Create `.env` files for backend and frontend. See examples and ask your local boffin for details.

Install `docker-compose`, if not already installed.

## Development workflow

Run `npm ci` in the each of the root, backend and frontend directories to install dependencies.

Create separate shells for the database container, backend and frontend:

```bash
cd backend
docker-compose up
```

```bash
cd frontend
npm run dev
```

```bash
cd backend
npm run migrate
npm run dev
```

If the database doesn't seem to do anything, ie. no messages after the initial ones after running `docker-compose up` and the database queries are not getting through, run `docker-compose down` and try again. You can always run the database container in detached mode (`-d`) but then you won't see the logs live.

Run `npm run prettier` in the root directory before committing. The commit runs hooks to check this as well as some linters, type checks etc.

<details>
<summary>Using pre-built <code>librdkafka</code> to speed up backend development</summary>

By default, `node-rdkafka` builds `librdkafka` from the source. This can take minutes on a bad day and can slow development down quite considerably, especially when you're working with different branches with different dependencies and need to run `npm ci` often. However, there's an option to use the version installed locally.

Do this in some other directory than the project one:

```bash
wget https://github.com/edenhill/librdkafka/archive/v2.0.2.tar.gz  -O - | tar -xz
cd librdkafka-2.0.2
./configure --prefix=/usr
make && make install
```

You may have to do some of that as root. Alternatively, you can install a prebuilt package - see [here](https://github.com/edenhill/librdkafka) for more information.

Set the env `BUILD_LIBRDKAFKA=0` when doing `npm ci` or similar on the backend to skip the build.

</details>

## More documentation

- [Kafka](docs/kafka.md)
- [GraphQL](docs/graphql.md)
