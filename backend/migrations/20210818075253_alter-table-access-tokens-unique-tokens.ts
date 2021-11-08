import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  try {
    await knex.transaction(async (trx) => {
      await trx.raw(`
      ALTER TABLE access_tokens ADD CONSTRAINT access_tokens_access_token_constraint UNIQUE (access_token);
    `)
    })
  } catch {}

  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS "access_tokens.access-token._UNIQUE" ON "access_tokens" USING btree (access_token);
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE access_tokens DROP CONSTRAINT access_tokens_access_token_constraint;
  `)
  await knex.raw(`
    DROP INDEX IF EXISTS access_tokens_access_token_constraint;
  `)
}
