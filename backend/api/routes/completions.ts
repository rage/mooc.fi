import { stringify } from "csv-stringify/sync"
import { Request, Response } from "express"
import JSONStream from "JSONStream"
import jwt, { Secret } from "jsonwebtoken"
import { chunk, omit } from "lodash"
import * as XLSX from "xlsx"
import * as yup from "yup"

import {
  Completion,
  Course,
  CourseTranslation,
  OpenUniversityRegistrationLink,
  User,
} from "@prisma/client"

import { generateUserCourseProgress } from "../../bin/kafkaConsumer/common/userCourseProgress/generateUserCourseProgress"
import { err, isDefined } from "../../util"
import { ApiContext, Controller } from "../types"

const languageMap: Record<string, string> = {
  en: "en_US",
  sv: "sv_SE",
  fi: "fi_FI",
}

// JWT secret for signing download tokens
const JWT_SECRET = process.env.JWT_SECRET as Secret

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required")
}

interface DownloadTokenPayload {
  courseId: string
  fromDate?: string
  format?: "csv" | "excel"
}

interface RegisterCompletionInput {
  completion_id: string
  student_number: string
  eligible_for_ects?: boolean
  tier?: number
  registration_date?: string
}
interface Tier {
  tier: number
  name: string
  course_id: string
  adjacent: Array<Tier>
}

interface TierData {
  name: string
  link: string | null
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

    return // NOSONAR
  }

  completionsCSVToken = async (
    req: Request<{ courseId: string }>,
    res: Response,
  ) => {
    const { courseId } = req.params
    const { fromDate, format } = req.query
    const adminRes = await this.requireAdmin(req, res)

    if (adminRes.isErr()) {
      return adminRes.error
    }

    const course = await this.ctx.prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Generate a signed JWT token valid for 30 seconds
    const payload: DownloadTokenPayload = {
      courseId,
      fromDate: typeof fromDate === "string" ? fromDate : undefined,
      format: format === "excel" ? "excel" : "csv",
    }

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "30s",
    })

    return res.status(200).json({ token })
  }

  completionsCSV = async (
    req: Request<{ courseId: string }>,
    res: Response,
  ) => {
    const { courseId } = req.params
    const { token } = req.query
    const { knex } = this.ctx

    // Validate token
    if (!token || typeof token !== "string") {
      return res.status(401).json({ message: "Invalid or missing token" })
    }

    let tokenData: DownloadTokenPayload
    try {
      tokenData = jwt.verify(token, JWT_SECRET) as DownloadTokenPayload
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired" })
      }
      return res.status(401).json({ message: "Invalid token" })
    }

    if (tokenData.courseId !== courseId) {
      return res
        .status(403)
        .json({ message: "Token not valid for this course" })
    }

    const fromDate = tokenData.fromDate
    const format = tokenData.format ?? "csv"

    const course = await this.ctx.prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    let query = knex
      .select<any, any[]>(
        "u.id",
        "com.email",
        "u.first_name",
        "u.last_name",
        "com.completion_date",
        "com.completion_language",
        "com.grade",
      )
      .from("completion as com")
      .join("course as c", "com.course_id", "c.id")
      .join("user as u", "com.user_id", "u.id")
      .where("c.id", course.completions_handled_by_id ?? course.id)
      .distinct("u.id", "com.course_id")
      .orderBy("com.completion_date", "asc")
      .orderBy("u.last_name", "asc")
      .orderBy("u.first_name", "asc")
      .orderBy("u.id", "asc")

    if (fromDate && typeof fromDate === "string") {
      try {
        const date = new Date(fromDate)
        query = query.where("com.completion_date", ">=", date)
      } catch (e) {
        return res.status(400).json({ message: "Invalid date format" })
      }
    }

    const completions = await query

    const headers = [
      "User ID",
      "Email",
      "First Name",
      "Last Name",
      "Completion Date",
      "Completion Language",
      "Grade",
    ]

    const rows = completions.map((row) => [
      row.id,
      row.email,
      row.first_name,
      row.last_name,
      row.completion_date,
      row.completion_language,
      row.grade,
    ])

    if (format === "excel") {
      // Generate Excel file
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Completions")

      const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      })

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      )
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="completions_${
          fromDate ? fromDate.toString().split("T")[0] : "all"
        }.xlsx"`,
      )

      return res.status(200).send(excelBuffer)
    }

    // Default CSV format
    const csvContent = stringify([headers, ...rows])

    res.setHeader("Content-Type", "text/csv")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="completions_${
        fromDate ? fromDate.toString().split("T")[0] : "all"
      }.csv"`,
    )

    return res.status(200).send(csvContent)
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
        .select<"tiers", OpenUniversityRegistrationLink[]>("tiers")
        .from("open_university_registration_link")
        .where("course_id", course.id)
    )?.[0].tiers as Array<Tier | null> | null

    const tierData: Array<TierData> = []

    if (tiers) {
      const t = tiers.filter(isDefined)

      for (const element of t) {
        if (element.tier === completion.tier) {
          const tierRegister = (
            await knex
              .select<any, OpenUniversityRegistrationLink[]>("link")
              .from("open_university_registration_link")
              .where("course_id", element.course_id)
          )?.[0]

          tierData.push({ name: element.name, link: tierRegister.link })

          if (element.adjacent) {
            for (const adjacentElement of element.adjacent) {
              const adjRegister = (
                await knex
                  .select<any, OpenUniversityRegistrationLink[]>("link")
                  .from("open_university_registration_link")
                  .where("course_id", adjacentElement.course_id)
              )?.[0]

              tierData.push({
                name: adjacentElement.name,
                link: adjRegister.link,
              })
            }
          }
        }
      }
    }

    return res.status(200).json({ tierData })
  }

  updateCertificateId = async (
    req: Request<
      {
        slug: string
      },
      any,
      {
        user_upstream_id: number | string
        certificate_id: string
      }
    >,
    res: Response,
  ) => {
    const { prisma } = this.ctx
    const adminRes = await this.requireAdmin(req, res)

    if (adminRes.isErr()) {
      return adminRes.error
    }

    const { slug } = req.params
    const { user_upstream_id, certificate_id } = req.body

    const user = await prisma.user.findUnique({
      where: {
        upstream_id: Number(user_upstream_id),
      },
    })

    if (!user) {
      return res.status(404).json({ message: "user not found" })
    }

    const course = await prisma.course.findUniqueOrAlias({
      where: {
        slug,
      },
    })

    if (!course) {
      return res.status(404).json({ message: "course not found" })
    }

    const completion = await this.getCompletion(course, user)

    if (!completion) {
      return res.status(404).json({ message: "completion not found" })
    }

    const updatedCompletion = await prisma.completion.update({
      where: {
        id: completion.id,
      },
      data: {
        certificate_id,
      },
    })

    return res.status(200).json(updatedCompletion)
  }

  private getCompletion = async (
    course: Course,
    user: User,
  ): Promise<Completion | null> => {
    return (
      (
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
      )?.[0] ?? null
    )
  }

  recheckCompletion = async (
    req: Request<
      any,
      any,
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

    if (adminRes.isErr()) {
      return adminRes.error
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

    const course = await prisma.course.findUniqueOrAlias({
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
      any,
      any,
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

    if (!completions || !(completions instanceof Array)) {
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
