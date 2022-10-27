When running the local dev environment for the first time, a few extra commands need to be run.

In addition you need to create a .env file in backend/ (copy backend/.env.example and update necessary values)

Run `npm ci` in repo root.

for frontend:

1. `cd frontend`
2. `npm ci`
3. `npm run dev`

for backend:

1. `cd backend`
2. `docker-compose up`

then in another terminal:

1. `cd backend`
2. `npm ci`
3. `sudo -u postgres psql` to open psql terminal
4. In psql terminal run `CREATE ROLE prisma WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD 'prisma';`
5. ctrl+d to exit the psql terminal
6. `psql -U prisma -h 0.0.0.0 -p 5678 -W`
7. Enter the password that was created in step 4 ("prisma")
7. `npm run migrate`
8. `npm run dev`
