import { Completion } from "@prisma/client"
import { ApiContext } from "."
import { getOrganization } from "../util/server-functions"

const JSONStream = require("JSONStream")

export function completions({ knex }: ApiContext) {
  return async function (req: any, res: any) {
    const organizationResult = await getOrganization(knex)(req, res)

    if (organizationResult.isErr()) {
      return organizationResult.error
    }

    // TODO/FIXME? organization value not used

    let course_id: string

    const course = (
      await knex
        .select("id")
        .from("course")
        .where({ slug: req.params.course })
        .limit(1)
    )[0]
    if (!course) {
      const course_alias = (
        await knex
          .select("course_id")
          .from("course_alias")
          .where({ course_code: req.params.course })
      )[0]
      if (!course_alias) {
        return res.status(404).json({ message: "Course not found" })
      }
      course_id = course_alias.course_id
    } else {
      course_id = course.id
    }
    const sql = knex.select<any, Completion[]>("*").from("completion").where({
      course_id,
      eligible_for_ects: true,
    })
    res.set("Content-Type", "application/json")

    // TODO/FIXME: typings broke on Knex update
    const stream = (sql.stream() as any).pipe(JSONStream.stringify()).pipe(res)
    req.on("close", stream.end.bind(stream))
  }
}
