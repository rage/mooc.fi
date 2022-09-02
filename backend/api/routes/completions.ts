import { Request, Response } from "express"
import { chunk, omit } from "lodash"
import * as yup from "yup"

import {
  Completion,
  Course,
  CourseTranslation,
  OpenUniversityRegistrationLink,
  User,
} from "@prisma/client"

import { generateUserCourseProgress } from "../../bin/kafkaConsumer/common/userCourseProgress/generateUserCourseProgress"
import { err } from "../../util/result"
import { ApiContext, Controller } from "../types"

const JSONStream = require("JSONStream")

const languageMap: Record<string, string> = {
  en: "en_US",
  sv: "sv_SE",
  fi: "fi_FI",
}

interface RegisterCompletionInput {
  completion_id: string
  student_number: string
  eligible_for_ects?: boolean
  tier?: number
  registration_date?: string
}
export class CompletionController extends Controller {
  constructor(override readonly ctx: ApiContext) {
    super(ctx)
  }

  completions = async (req: Request<{ slug: string }>, res: Response) => {
    const { slug } = req.params
    const { knex } = this.ctx
    const organizationResult = await this.getOrganization(req, res)

    if (organizationResult.isErr()) {
      return organizationResult.error
    }

    // TODO/FIXME? organization value not used

    const { registered } = req.query

    const course = await this.getCourseKnex({ slug })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const sql = knex
      .select<any, Completion[]>("completion.*")
      .distinctOn("completion.user_id", "completion.course_id")
      .from("completion")
      .fullOuterJoin(
        "completion_registered",
        "completion.id",
        "completion_registered.completion_id",
      )
      .where(
        "completion.course_id",
        course.completions_handled_by_id ?? course.id,
      )
      .andWhere("eligible_for_ects", true)

    if (!registered) {
      sql.whereNull("completion_registered.id")
    }

    sql.orderBy([
      "completion.user_id",
      "completion.course_id",
      { column: "completion.created_at", order: "asc" },
    ])

    res.set("Content-Type", "application/json")

    const stream = sql.stream().pipe(JSONStream.stringify()).pipe(res)
    req.on("close", stream.end.bind(stream))
  }

  completionInstructions = async (
    req: Request<{ slug: string; language: string }>,
    res: Response,
  ) => {
    const { knex } = this.ctx
    const { slug, language } = req.params

    const course = await this.getCourseKnex({ slug })
    if (!course) {
      return res.status(404).json("")
    }

    const instructions = (
      await knex
        .select<any, CourseTranslation[]>("instructions")
        .from("course_translation")
        .where("course_id", course.id)
        .where("language", languageMap[language] ?? "fi_FI")
    )[0]?.instructions

    if (instructions) {
      return res.status(200).json(instructions)
    } else {
      return res.status(404).json("")
    }
  }

  completionTiers = async (req: Request<{ slug: string }>, res: Response) => {
    const { knex } = this.ctx
    const getUserResult = await this.getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value
    const { slug } = req.params

    // TODO: typing
    let tierData: any = []

    const course = await this.getCourseKnex({ slug })

    if (!course) {
      return err(res.status(404).json({ message: "course not found" }))
    }

    const completion = (
      await knex
        .select<any, Completion[]>("tier")
        .from("completion")
        .where("course_id", course.completions_handled_by_id ?? course.id)
        .andWhere("user_id", user.id)
        .orderBy("created_at", "asc")
    )?.[0]

    if (!completion) {
      return err(res.status(404).json({ message: "completion not found" }))
    }

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

  private getCompletion = async (
    course: Course,
    user: User,
  ): Promise<Completion | null> => {
    return (
      await this.ctx.prisma.user
        .findUnique({
          where: {
            id: user.id,
          },
        })
        .completions({
          where: {
            course_id: course.completions_handled_by_id ?? course.id,
          },
          orderBy: { created_at: "asc" },
          take: 1,
        })
    )?.[0]
  }

  recheckCompletion = async (
    req: Request<
      {},
      {},
      {
        course_id?: string
        slug?: string
        user_id?: string
        user_upstream_id?: number
      }
    >,
    res: Response,
  ) => {
    const { prisma } = this.ctx
    const adminRes = await this.requireAdmin(req, res)

    if (adminRes !== true) {
      return adminRes
    }

    const { course_id, slug, user_id, user_upstream_id } = req.body

    if (!course_id && !slug) {
      return res.status(400).json({
        message: "Missing course_id and slug - please provide exactly one",
      })
    }
    if (course_id && slug) {
      return res
        .status(400)
        .json({ message: "Please provide exactly one of course_id and slug" })
    }
    if (!user_id && !user_upstream_id) {
      return res.status(400).json({
        message:
          "Missing user_id and user_upstream_id - please provide exactly one",
      })
    }
    if (user_id && user_upstream_id) {
      return res.status(400).json({
        message: "Please provide exactly one of user_id and user_upstream_id",
      })
    }

    const course = await this.getCourse({
      where: {
        id: course_id ?? undefined,
        slug: slug ?? undefined,
      },
    })

    if (!course) {
      return res.status(404).json({ message: "course not found" })
    }

    const userWithProgresses = await prisma.user.findUnique({
      where: {
        id: user_id,
        upstream_id: user_upstream_id,
      },
      include: {
        user_course_progresses: {
          where: {
            course_id: course.id,
          },
          orderBy: { created_at: "asc" },
        },
      },
    })

    if (!userWithProgresses) {
      return res.status(404).json({ message: "user not found" })
    }

    const { user_course_progresses } = userWithProgresses

    if (user_course_progresses.length < 1) {
      return res.status(404).json({ message: "No progresses found" })
    }

    const existingCompletion = await this.getCompletion(
      course,
      userWithProgresses,
    )

    await generateUserCourseProgress({
      user: omit(userWithProgresses, "user_course_progresses"),
      course,
      userCourseProgress: user_course_progresses[0],
      context: this.ctx,
    })

    const updatedCompletion = await this.getCompletion(
      course,
      userWithProgresses,
    )

    if (!existingCompletion && updatedCompletion) {
      return res.status(200).json({
        message: "Completion created",
        completion: updatedCompletion,
      })
    }
    if (
      existingCompletion?.updated_at?.getTime() !==
      updatedCompletion?.updated_at?.getTime()
    ) {
      return res
        .status(200)
        .json({ message: "Completion updated", completion: updatedCompletion })
    }
    return res
      .status(200)
      .json({ message: "No change", completion: existingCompletion })
  }

  registerCompletions = async (
    req: Request<
      {},
      {},
      {
        completions: RegisterCompletionInput[]
      }
    >,
    res: Response,
  ) => {
    const { prisma } = this.ctx
    const organizationResult = await this.getOrganization(req, res)

    if (organizationResult.isErr()) {
      return organizationResult.error
    }

    const org = organizationResult.value

    const { completions } = req.body ?? {}

    if (!completions) {
      return res
        .status(400)
        .json({ message: "must provide completions in post message body" })
    }

    const registerCompletionSchema = yup.array().of(
      yup
        .object()
        .shape({
          completion_id: yup.string().min(32).max(36).required(),
          student_number: yup.string().required(),
        })
        .required(),
    )

    try {
      await registerCompletionSchema.validate(completions)
    } catch (error) {
      return res.status(400).json({ message: "malformed data", error })
    }

    const buildPromises = (data: RegisterCompletionInput[]) => {
      return data.map(async (entry) => {
        const { course_id, user_id } =
          (await prisma.completion.findUnique({
            where: { id: entry.completion_id },
            select: { course_id: true, user_id: true },
          })) ?? {}

        if (!course_id || !user_id) {
          // TODO/FIXME: we now fail silently if course/user not found
          return Promise.resolve()
        }

        return prisma.completionRegistered.create({
          data: {
            completion: {
              connect: { id: entry.completion_id },
            },
            organization: {
              connect: { id: org?.id },
            },
            course: { connect: { id: course_id } },
            real_student_number: entry.student_number,
            registration_date: entry.registration_date ?? null,
            user: { connect: { id: user_id } },
          },
        })
      })
    }

    const queue = chunk(completions, 500)
    for (const completionChunk of queue) {
      const promises = buildPromises(completionChunk)
      await Promise.all(promises)
    }

    return res.status(200).json({ message: "success" })
  }
}