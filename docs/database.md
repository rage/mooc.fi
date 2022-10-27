# Connect to database

## local

1. `psql -h localhost -p 5678 -U prisma -W`
2. enter password `prisma`
3. run `set search_path to "default$default";`

## production

1. in a terminal window run
`cloud_sql_proxy -instances=moocfi:europe-north1:quizzes-backend=tcp:0.0.0.0:3306`
to proxy production to localhost port 3306

when connecting first time, run the following to get db_name and db_secret

1. `kubectl get secrets`
2. `kubectl edit secret backend-secret`
3. base64 decode `db_name` and `db_secret`

### DataGrip

for easy access, we recommend using DataGrip

After installing DataGrip

1. add new data source --> postgresql
2. give a name to the source
3.
* `localhost` in host field,
* `3306` in port field,
* `postgres` in user field,
* db_secret from earlier to the password field,
* `postgres` in database field
4. in Schemas-tab, check which dbs you want (probably certificates, exams, moocfi, quizzes1, 2 and 3, staging, maybe others based on usage)
5. refresh the data source in the database explorer to see the databases
6. for moocfi -db, set schema in console to `moocfi$production` (this must be done every time you use datagrip)

now you can run sql commands in console, test for example `select * from course;` and you should see courses listed in output window.

you can name queries by adding comments before queries, e.g. `/*query all courses*/`

## Miscellaneous stuff

### Check pod status

`kubectl get pods`

### Check logs

`stern <pod cluster prefix>`, prefix is e.g. moocfi-backend
