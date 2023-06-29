import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    DO $do$ BEGIN
      IF NOT EXISTS (SELECT FROM pg_constraint 
      WHERE conrelid = 'email_delivery'::regclass AND conname = 'email_delivery_pkey') THEN 
        ALTER TABLE "email_delivery"
          ADD CONSTRAINT "email_delivery_pkey" PRIMARY KEY (id);
      END IF;
    END $do$;
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE "email_delivery"
      DROP CONSTRAINT IF EXISTS "email_delivery_pkey";
  `)
}
