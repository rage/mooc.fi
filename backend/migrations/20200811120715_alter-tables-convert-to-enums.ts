import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE "course" ALTER COLUMN "status" DROP DEFAULT;`)
  await knex.raw(
    `ALTER TABLE "course" ALTER COLUMN "status" TYPE "CourseStatus" USING "status"::text::"CourseStatus";`,
  )
  await knex.raw(
    `ALTER TABLE "course" ALTER COLUMN "status" SET DEFAULT 'Upcoming';`,
  )

  await knex.raw(
    `ALTER TABLE "user_organization" ALTER COLUMN "role" DROP DEFAULT;`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" ALTER COLUMN "role" TYPE "OrganizationRole" USING "role"::text::"OrganizationRole";`,
  )
  await knex.raw(
    `ALTER TABLE "user_organization" ALTER COLUMN "role" SET DEFAULT 'Student';`,
  )
}

export async function down(_knex: Knex): Promise<void> {
  return
}
