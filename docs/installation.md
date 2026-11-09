When running the local dev environment for the first time, a few extra commands need to be run.

In addition you need to create a .env file in backend/ (copy backend/.env.example and update necessary values)

Use the Node.js version pinned in `package.json` (`nix develop` provides it).

Run `pnpm install` in repo root.

for frontend:

1. `cd frontend`
2. `pnpm install`
3. `pnpm run dev`

for backend:

1. `cd backend`
2. `docker-compose up`

then in another terminal:

1. `cd backend`
2. `pnpm install`
3. `sudo -u postgres psql` to open psql terminal
4. In psql terminal run `CREATE ROLE prisma WITH SUPERUSER CREATEDB CREATEROLE LOGIN ENCRYPTED PASSWORD 'prisma';`
5. ctrl+d to exit the psql terminal
6. `psql -U prisma -h 0.0.0.0 -p 5678 -W`
7. Enter the password that was created in step 4 ("prisma")
8. `create schema "default$default";`
9. ctrl+d to exit the psql terminal
10. Make a `.env` file in `backend/` based on `backend/.env.example`, and update its DB_* values based on previous steps 5-9
11. `pnpm run migrate`
12. `pnpm run dev`
13. In another window run the following commands in the `backend/` directory
    - `pnpm run build`
    - `pnpm run seedAll`
    - `pnpm run generate`
