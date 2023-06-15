# Migrating from an older version

If your development database is created with the older version, it is not usable with the newer one straight away. To keep the old one, have the old version running in `docker compose` -- if you've already merged this, just change the image back to `postgres:10.3` -- and do a `pg_dump`:

```bash
pg-dump -h localhost -p 5678 -U prisma -W > /tmp/moocfi-dev-dump
```

Provide `prisma` for the password.
 
You can probably do the dump inside the running container, but you will need to move the dump file contents to your local machine as we will delete the container. 

Do `docker compose down` and you can delete the container and the volume:

```bash
docker container rm backend-postgres-1
docker volume rm backend_postgres
```

Change the image version back to `postgres:15.3`,  do `docker compose up` and it should create the database. While it's running, restore the database contents:

```bash
psql -h localhost -p 5678 -U prisma -W prisma < /tmp/moocfi-dev-dump
```