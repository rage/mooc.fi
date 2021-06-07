import {
  Completion,
  OpenUniversityRegistrationLink,
  CourseTranslation,
  Course,
} from "@prisma/client"
import { ApiContext } from "."
import { getOrganization } from "../util/server-functions"
import { getUser } from "../util/server-functions"

const JSONStream = require("JSONStream")

export function completions({ knex }: ApiContext) {
  return async function (req: any, res: any) {
    const organizationResult = await getOrganization(knex)(req, res)

    if (organizationResult.isErr()) {
      return organizationResult.error
    }

    // TODO/FIXME? organization value not used

    const { registered } = req.query

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
    const sql = knex
      .select<any, Completion[]>("completion.*")
      .from("completion")
      .fullOuterJoin(
        "completion_registered",
        "completion.id",
        "completion_registered.completion_id",
      )
      .where({
        "completion.course_id": course_id,
        eligible_for_ects: true,
        ...(!registered && { "completion_registered.id": null }),
      })

    res.set("Content-Type", "application/json")

    // TODO/FIXME: typings broke on Knex update
    const stream = (sql.stream() as any).pipe(JSONStream.stringify()).pipe(res)
    req.on("close", stream.end.bind(stream))
  }
}

export function completionInstructions({ knex }: ApiContext) {
  return async function (req: any, res: any) {
    const id = req.params.id

    const course = (
      await knex.select<any, Course[]>("id").from("course").where("slug", id)
    )[0]

    const instructions = (
      await knex
        .select<any, CourseTranslation[]>("instructions")
        .from("course_translation")
        .where("course_id", course.id)
    )[0]?.instructions

    return res.status(200).json(instructions)
  }
}

export function completionTiers({ knex }: ApiContext) {
  return async function (req: any, res: any) {
    const getUserResult = await getUser(knex)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const id = req.params.id
    let tierData: any = []

    const course = (
      await knex.select<any, Course[]>("id").from("course").where("slug", id)
    )[0]

    const tiers = (
      await knex
        .select<any, OpenUniversityRegistrationLink[]>("tiers")
        .from("open_university_registration_link")
        .where("course_id", course.id)
    )?.[0].tiers

    if (tiers) {
      let t: any = tiers

      for (let i = 0; i < t.length; i++) {
        let completionCheck = (
          await knex
            .select<any, Completion[]>("*")
            .from("completion")
            .where("course_id", t[i].course_id)
            .andWhere("user_id", user.id)
        )?.[0]

        if (completionCheck) {
          let tierRegister = (
            await knex
              .select<any, OpenUniversityRegistrationLink[]>("link")
              .from("open_university_registration_link")
              .where("course_id", t[i].course_id)
          )?.[0]

          tierData.push({ name: t[i].name, link: tierRegister.link })
        }

        if (t[i].adjacent) {
          for (let j = 0; j < t[i].adjacent.length; j++) {
            const exists = t.find(
              (data: any) => data.course_id === t[i].adjacent[j].course_id,
            )
            if (!exists) {
              let adjRegister = (
                await knex
                  .select<any, OpenUniversityRegistrationLink[]>("link")
                  .from("open_university_registration_link")
                  .where("course_id", t[i].adjacent[j].course_id)
              )?.[0]

              tierData.push({
                name: t[i].adjacent[j].name,
                link: adjRegister.link,
              })
            }
          }
        }
      }
    }

    return res.status(200).json({ tierData })
  }
}
