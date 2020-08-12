import * as Knex from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE "course" ALTER COLUMN "status" TYPE "CourseStatus" USING "status"::"CourseStatus";`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" ALTER COLUMN "role" TYPE "OrganizationRole" USING "role"::"OrganizationRole";`,
  )
}

export async function down(_knex: Knex): Promise<void> {}
