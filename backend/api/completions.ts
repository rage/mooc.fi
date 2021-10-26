import {
  Completion,
  Course,
  CourseTranslation,
  OpenUniversityRegistrationLink,
} from "@prisma/client"

import { getOrganization, getUser } from "../util/server-functions"
import { ApiContext } from "./"

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
    let language = req.params.language

    const course = (
      await knex.select<any, Course[]>("id").from("course").where("slug", id)
    )[0]

    switch (language) {
      case "en":
        language = "en_US"
        break
      case "fi":
        language = "fi_FI"
        break
      case "sv":
        language = "sv_SE"
        break
      default:
        language = "fi_FI"
    }

    const instructions = (
      await knex
        .select<any, CourseTranslation[]>("instructions")
        .from("course_translation")
        .where("course_id", course.id)
        .where("language", language)
    )[0]?.instructions

    if (instructions) {
      return res.status(200).json(instructions)
    } else {
      return res.status(404).json("")
    }
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

    const completion = (
      await knex
        .select<any, Completion[]>("tier")
        .from("completion")
        .where("course_id", course.id)
        .andWhere("user_id", user.id)
    )?.[0]

    // TODO/FIXME: note - this now happily ignores completion_language and just gets the first one
    // - as it's now only used in BAI, shouldn't be a problem?
    const tiers = (
      await knex
        .select<any, OpenUniversityRegistrationLink[]>("tiers")
        .from("open_university_registration_link")
        .where("course_id", course.id)
    )?.[0].tiers

    if (tiers) {
      let t: any = tiers

      for (let i = 0; i < t.length; i++) {
        if (t[i].tier === completion.tier) {
          const tierRegister = (
            await knex
              .select<any, OpenUniversityRegistrationLink[]>("link")
              .from("open_university_registration_link")
              .where("course_id", t[i].course_id)
          )?.[0]

          tierData.push({ name: t[i].name, link: tierRegister.link })

          if (t[i].adjacent) {
            for (let j = 0; j < t[i].adjacent.length; j++) {
              const adjRegister = (
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

      return res.status(200).json({ tierData })
    }
  }
}
