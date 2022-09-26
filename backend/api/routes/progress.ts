import { Request, Response } from "express"
import { chunk, groupBy, omit } from "lodash"

import { Completion, User, UserCourseProgress } from "@prisma/client"

import { generateUserCourseProgress } from "../../bin/kafkaConsumer/common/userCourseProgress/generateUserCourseProgress"
import { BAIParentCourse, BAItiers } from "../../config/courseConfig"
import { notEmpty } from "../../util/notEmpty"
import { ApiContext, Controller } from "../types"

interface ExerciseCompletionResult {
  user_id: string
  exercise_id: string
  n_points: string
  part: number
  section: number
  max_points: number
  completed: boolean
  quizzes_id: string
}

const isId = (idOrSlug: string) =>
  Boolean(idOrSlug.match(/^[0-9a-fA-F]{32}$/)) ||
  Boolean(idOrSlug.match(/^[0-9a-fA-F-]{36}$/))

export class ProgressController extends Controller {
  constructor(override readonly ctx: ApiContext) {
    super(ctx)
  }

  progress = async (req: Request<{ idOrSlug: string }>, res: Response) => {
    const { knex } = this.ctx
    const { idOrSlug } = req.params

    if (!idOrSlug) {
      return res.status(400).json({ message: "must provide id or slug" })
    }

    const getUserResult = await this.getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    let id = isId(idOrSlug) ? idOrSlug : undefined

    if (!id) {
      const course = await this.getCourseKnex({ slug: idOrSlug })

      if (!course) {
        return res.status(404).json({ message: "course not found" })
      }

      id = course.id
    }

    const exercise_completions = await knex("exercise_completion as ec")
      .select<any, ExerciseCompletionResult[]>(
        "user_id",
        "exercise_id",
        "n_points",
        "part",
        "section",
        "max_points",
        "completed",
        "custom_id as quizzes_id",
      )
      .distinctOn("ec.exercise_id")
      .join("exercise as e", { "ec.exercise_id": "e.id" })
      .where("e.course_id", id)
      .andWhere("ec.user_id", user.id)
      .orderBy([
        "ec.exercise_id",
        { column: "ec.timestamp", order: "desc" },
        { column: "ec.updated_at", order: "desc" },
      ])

    const resObject = (exercise_completions ?? []).reduce(
      (acc, curr) => ({
        ...acc,
        [curr.exercise_id]: {
          ...curr,
          // tier: baiCourseTiers[curr.quizzes_id],
        },
      }),
      {},
    )

    res.json({
      data: resObject,
    })
  }

  progressV2 = async (
    req: Request<{ idOrSlug: string }, {}, {}, { deleted?: string }>,
    res: Response,
  ) => {
    const { knex } = this.ctx
    const { idOrSlug } = req.params
    const { deleted = "" } = req.query

    const includeDeleted = deleted.toLowerCase().trim() === "true"

    if (!idOrSlug) {
      return res.status(400).json({ message: "must provide id or slug" })
    }

    const getUserResult = await this.getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const id = isId(idOrSlug) ? idOrSlug : undefined
    const slug = !id ? idOrSlug : undefined

    const course = await this.getCourseKnex({ id, slug })

    if (!course) {
      return res.status(404).json({ message: "course not found" })
    }

    // TODO: this could also return the required actions
    const exerciseCompletionQuery = knex("exercise_completion as ec")
      .select<any, ExerciseCompletionResult[]>(
        "user_id",
        "exercise_id",
        "n_points",
        "part",
        "section",
        "max_points",
        "completed",
        "custom_id as quizzes_id",
      )
      .distinctOn("ec.exercise_id")
      .join("exercise as e", { "ec.exercise_id": "e.id" })
      .where("e.course_id", course.id)
      .andWhere("ec.user_id", user.id)
      .orderBy([
        "ec.exercise_id",
        { column: "ec.timestamp", order: "desc" },
        { column: "ec.updated_at", order: "desc" },
      ])

    if (!includeDeleted) {
      exerciseCompletionQuery.andWhereNot("e.deleted", true)
    }

    const exercise_completions = await exerciseCompletionQuery

    const completions = await knex("completion as c")
      .select<any, Completion[]>("*")
      .where("course_id", course.completions_handled_by_id ?? course.id)
      .andWhere("user_id", user.id)
      .orderBy("created_at", "asc")

    const exercise_completions_map = (exercise_completions ?? []).reduce(
      (acc, curr) => ({
        ...acc,
        [curr.exercise_id]: {
          ...curr,
          // tier: baiCourseTiers[curr.quizzes_id],
        },
      }),
      {},
    )

    res.json({
      data: {
        course_id: course.id,
        user_id: user.id,
        exercise_completions: exercise_completions_map,
        completion: completions[0] ?? {},
      },
    })
  }

  tierProgress = async (
    req: Request<{ idOrSlug: string; user_id?: string }>,
    res: Response,
  ) => {
    const { idOrSlug, user_id } = req.params
    const { knex } = this.ctx

    if (!idOrSlug) {
      return res.status(400).json({ message: "must provide course id or slug" })
    }

    let user: User | null = null

    if (user_id) {
      const adminRes = await this.requireAdmin(req, res)

      if (adminRes !== true) {
        return adminRes
      }
      user = (
        await knex("user")
          .select<any, User[]>("id")
          .where("upstream_id", user_id)
      )?.[0]
      if (!user) {
        return res.status(404).json({ message: "user not found" })
      }
    } else {
      const getUserResult = await this.getUser(req, res)

      if (getUserResult.isErr()) {
        return getUserResult.error
      }
      user = getUserResult.value.user
    }

    let id = isId(idOrSlug) ? idOrSlug : undefined

    if (!id) {
      const course = await this.getCourseKnex({ slug: idOrSlug })

      if (!course) {
        return res.status(404).json({ message: "course not found" })
      }

      id = course.id
    }

    const data = await knex
      .select<any, Pick<UserCourseProgress, "course_id" | "extra">[]>(
        "course_id",
        "extra",
      )
      .from("user_course_progress")
      .where("user_course_progress.course_id", id)
      .andWhere("user_course_progress.user_id", user.id)
      .orderBy("created_at", "asc")

    res.json({
      data: {
        course_id: id,
        ...(data[0]?.extra as object),
      },
    })
  }

  userCourseProgress = async (
    req: Request<{ slug: string }>,
    res: Response,
  ) => {
    const { slug } = req.params
    const { prisma } = this.ctx

    const getUserResult = await this.getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const course = await this.getCourse({
      where: { slug },
    })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const userCourseProgresses = await prisma.user
      .findUnique({
        where: { id: user.id },
      })
      .user_course_progresses({
        where: {
          course_id: course.id,
        },
        orderBy: {
          created_at: "asc",
        },
      })

    res.json({
      data: userCourseProgresses?.[0],
    })
  }

  recheckBAIUserCourseProgresses = async (req: Request, res: Response) => {
    const adminRes = await this.requireAdmin(req, res)

    if (adminRes !== true) {
      return adminRes
    }

    const { prisma, logger } = this.ctx

    const beginnerBAICourse = await prisma.course.findUnique({
      where: {
        id: BAItiers["1"],
      },
    })
    const intermediateBAICourse = await prisma.course.findUnique({
      where: {
        id: BAItiers["2"],
      },
    })
    const advancedBAICourse = await prisma.course.findUnique({
      where: {
        id: BAItiers["3"],
      },
    })

    if (!beginnerBAICourse || !intermediateBAICourse || !advancedBAICourse) {
      return res.status(500).json({ message: "BAI courses not found!" })
    }

    logger.info("Querying existing progresses and completions")
    const beforeParentProgresses = await prisma.course
      .findUnique({
        where: {
          id: BAIParentCourse,
        },
      })
      .user_course_progresses({
        distinct: ["user_id"],
        orderBy: {
          created_at: "asc",
        },
        include: {
          user: true,
        },
      })

    const beforeCompletions = await prisma.course
      .findUnique({
        where: {
          id: BAIParentCourse,
        },
      })
      .completions({
        distinct: ["user_id"],
        orderBy: {
          created_at: "asc",
        },
        include: {
          user: true,
        },
      })

    const getUsers = (arr: Array<object & { user: User | null }>) =>
      arr?.map((e) => e.user).filter(notEmpty) ?? []
    const getIds = (arr?: Array<object & { id: string }>) =>
      arr?.map((e) => e.id).filter(notEmpty) ?? []
    const getUserIdsAndUpstreamIds = (users: Array<User>) => ({
      user_ids: getIds(users),
      user_upstream_ids: users.map((u) => u.upstream_id),
    })

    const createDiff = (
      before: Array<
        object & {
          id: string
          user_id?: string | null
          user: User | null
          updated_at: Date | null
        }
      >,
      after: Array<
        object & {
          id: string
          user_id?: string | null
          user: User | null
          updated_at: Date | null
        }
      >,
    ) => {
      const beforeIds = getIds(before)
      const beforeUserIds = before.map((e) => e.user_id).filter(notEmpty)
      const beforeMap = groupBy(before, "id")

      const afterIds = getIds(after)
      const afterUsers = after.flatMap((e) => e.user).filter(notEmpty)

      const createdIds = afterIds.filter((id) => !beforeIds.includes(id))
      const createdUsers = afterUsers.filter(
        (u) => !beforeUserIds.includes(u.id),
      )
      const updated = after.filter((entry) => {
        const beforeEntry = beforeMap[entry.id]?.[0]

        return beforeEntry && entry.updated_at! > beforeEntry.updated_at!
      })
      const updatedUsers = getUsers(updated)

      return {
        created: {
          count: after.length - before.length,
          ids: createdIds,
          ...getUserIdsAndUpstreamIds(createdUsers),
        },
        updated: {
          count: updated.length,
          ids: getIds(updated),
          ...getUserIdsAndUpstreamIds(updatedUsers),
        },
      }
    }

    const orphanProgresses: Record<string, Array<string>> = {
      [beginnerBAICourse.slug]: [],
      [intermediateBAICourse.slug]: [],
      [advancedBAICourse.slug]: [],
    }

    for (const course of [
      beginnerBAICourse,
      intermediateBAICourse,
      advancedBAICourse,
    ]) {
      logger.info(`Handling ${course.slug}`)
      const userCourseProgresses = await prisma.course
        .findUnique({
          where: {
            id: course.id,
          },
        })
        .user_course_progresses({
          distinct: ["user_id"],
          orderBy: { created_at: "asc" },
          include: {
            user: true,
          },
        })

      if (userCourseProgresses.length) {
        logger.info(
          `Got ${userCourseProgresses?.length} user progresses, regenerating...`,
        )
      } else {
        logger.warn(`No progresses found? Continuing...`)
        continue
      }

      const chunks = chunk(userCourseProgresses, 100)

      const buildPromises = (chunk: typeof userCourseProgresses) => {
        return chunk.map(async (userCourseProgress) => {
          const { user } = userCourseProgress

          if (!user) {
            orphanProgresses[course.slug].push(userCourseProgress.id)
            return Promise.resolve()
          }

          const updated = await generateUserCourseProgress({
            user,
            course,
            userCourseProgress: omit(userCourseProgress, "user"),
            context: this.ctx,
          })

          if (updated.n_points !== userCourseProgress.n_points) {
            logger.info(
              `Updated points: ${user.upstream_id} ${course.slug} ${userCourseProgress.n_points} -> ${updated.n_points}`,
            )
          }
        })
      }

      let total = 0

      for (const chunk of chunks) {
        await Promise.all(buildPromises(chunk))
        total += chunk.length
        logger.info(
          `Processed ${total}/${userCourseProgresses.length} user progresses`,
        )
      }
    }

    logger.info("Querying updated progresses and completions")
    const afterParentProgresses = await prisma.course
      .findUnique({
        where: {
          id: BAIParentCourse,
        },
      })
      .user_course_progresses({
        distinct: ["user_id"],
        orderBy: {
          created_at: "asc",
        },
        include: {
          user: true,
        },
      })

    const afterCompletions = await prisma.course
      .findUnique({
        where: {
          id: BAIParentCourse,
        },
      })
      .completions({
        distinct: ["user_id"],
        orderBy: {
          created_at: "asc",
        },
        include: {
          user: true,
        },
      })

    const result = {
      progresses: {
        ...createDiff(beforeParentProgresses, afterParentProgresses),
        orphaned: orphanProgresses,
      },
      completions: {
        ...createDiff(beforeCompletions, afterCompletions),
      },
    }

    logger.info(`Done! Result: ${JSON.stringify(result, null, 2)}`)

    return res.status(200).json({
      message: "ok",
      ...result,
    })
  }
}
