# Development environment

## Requirements

Create `.env` files for backend and frontend. See examples and ask your local boffin for details.

## Development workflow

Node.js and pnpm versions are pinned in `package.json` (`devEngines.runtime`, `packageManager`). The Nix flake provides both: run `nix develop` (or let direnv load `.envrc`).

Run `pnpm install` in the repository root to install dependencies for every workspace.

Create separate shells for the database container, backend and frontend:

```bash
cd backend
docker-compose up
```

```bash
cd frontend
pnpm run dev
```

```bash
cd backend
pnpm run migrate
pnpm run dev
```

If the database doesn't seem to do anything, ie. no messages after the initial ones after running `docker compose up` and the database queries are not getting through, run `docker compose down` and try again. You can always run the database container in detached mode (`-d`) but then you won't see the logs live.

If you have used a development database with an older version of PostgreSQL and you want to keep your data, you will need to migrate it to the new version. See [here](docs/database.md) for instructions.

Run `pnpm run format` and `pnpm run lint` in the root directory before committing. The commit runs hooks to check this as well as some linters, type checks etc.

<details>
<summary>Using pre-built <code>librdkafka</code> to speed up backend development</summary>

By default, `node-rdkafka` builds `librdkafka` from the source. This can take minutes on a bad day and can slow development down quite considerably, especially when you're working with different branches with different dependencies and need to run `pnpm install` often. However, there's an option to use the version installed locally.

Do this in some other directory than the project one:

```bash
wget https://github.com/edenhill/librdkafka/archive/v2.0.2.tar.gz  -O - | tar -xz
cd librdkafka-2.0.2
./configure --prefix=/usr
make && make install
```

You may have to do some of that as root. Alternatively, you can install a prebuilt package - see [here](https://github.com/edenhill/librdkafka) for more information.

Set the env `BUILD_LIBRDKAFKA=0` when running `pnpm install` to skip the build.

</details>

## More documentation

- [Kafka](docs/kafka.md)
- [GraphQL](docs/graphql.md)
- [Database](docs/database.md)
