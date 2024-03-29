# Connect to database

## local

1. `psql -h localhost -p 5678 -U prisma -W`
2. enter password `prisma`
3. run `set search_path to "default$default";`

## production

Install `cloud_sql_proxy` ([installation](https://cloud.google.com/sql/docs/mysql/sql-proxy)) or alternatively add your IP range to the Google Cloud Console (SQL -> Connections -> Authorized networks)

If you decided to install `cloud_sql_proxy`, in a terminal window run
`cloud_sql_proxy -instances=moocfi:europe-north1:quizzes-backend=tcp:0.0.0.0:3306`
to proxy production to localhost port 3306

(Note that this has to be run every time you want to connect to the database, the alternative of adding IP range to the Google Cloud Console needs to be done only once)

Install kubectl and set credentials to access the cluster: https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl - `gcloud container clusters get-credentials <CLUSTER_NAME>`

Change to correct namespace using `kubectl ns moocfi`

When connecting first time, run the following to get db_name and db_secret:

1. `kubectl get secrets`
2. `kubectl edit secret backend-secret`
3. base64 decode `db_name` and `db_secret`

### DataGrip

For easy access, we recommend using DataGrip

After installing DataGrip

1. add new data source --> postgresql
2. give a name to the source
3. insert
    * `localhost` in host field,
    * `3306` in port field,
    * `postgres` in user field,
    * db_secret from earlier to the password field,
    * `postgres` in database field
5. in Schemas-tab, check which dbs you want (probably certificates, exams, moocfi, quizzes1, 2 and 3, staging, maybe others based on usage)
6. refresh the data source in the database explorer to see the databases
7. for `moocfi` database, set schema in console to `moocfi$production` 
    - You can save this on console/SQL file basis; needs to be set again for each new window, though: https://www.jetbrains.com/help/datagrip/schemas.html#save-a-search-path-between-ide-restarts

Now you can run sql commands in console, test for example `select * from course;` and you should see courses listed in output window.

You can name queries by adding comments before queries, e.g. `/*query all courses*/` -- this will be shown in the output window title, which helps finding the query results among many tabs. We recommend configuring DataGrip to open a new result window for each query: https://www.jetbrains.com/help/datagrip/viewing-query-results.html#open-a-new-tab-for-each-query

## Miscellaneous stuff

### Useful kubectl commands

* `kubectl get pods` - Check pod status
* `kubectl logs <pod_name>` - get logs for a single pod
    - where `pod_name` is the full name with suffix like `fetch-avoin-links-27777615-xyzzy`
    - what `stern` (see below) does is basically `kubectl logs <prefix>*`
* `kubectl get jobs`
* `kubectl get cronjobs`
* `kubectl describe <resource> <resource_name>` - describe resource
    - where resource name like `job`, `pod` - get full list with `kubectl api-resources`
    - useful for debugging why a pod or job might have failed, for example `kubectl describe job sync-tmc-users-27780760` will help finding the logs for a recent job/cronjob - you can find the name for the pod that was created with describe, although the pods will be deleted after a set time
* `kubectl create job --from=cronjob/<cronjob_name> <job_name>` - run a cronjob manually
    - come up with a new unique job name; you can delete the job later when it's finished with `kubectl delete job <job name>`

### Check logs

Install [stern](https://github.com/wercker/stern) to check logs for all pods with a certain prefix easily.

`stern <pod cluster prefix>`, prefix is e.g. moocfi-backend

## Migrating from an older development database

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
