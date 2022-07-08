import { Request, Response } from "express"

import { Completion, Course, UserCourseProgress } from "@prisma/client"

import { getUser } from "../util/server-functions"
import { ApiContext } from "./"

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
  idOrSlug.match(/^[\d-]+$/) &&
  (idOrSlug.length === 32 || idOrSlug.length === 36)

export class ProgressController {
  constructor(readonly ctx: ApiContext) {}

  progress = async (req: Request<{ id: string }>, res: Response) => {
    const { knex } = this.ctx
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: "must provide id" })
    }

    const getUserResult = await getUser(this.ctx)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

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

    const getUserResult = await getUser(this.ctx)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const course = (
      await knex
        .select<any, Course[]>("*")
        .from("course")
        .where(isId(idOrSlug) ? "id" : "slug", idOrSlug)
        .limit(1)
    )?.[0]

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

  tierProgress = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    const { knex } = this.ctx

    if (!id) {
      return res.status(400).json({ message: "must provide course id" })
    }

    const getUserResult = await getUser(this.ctx)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

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

    const getUserResult = await getUser(this.ctx)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const course = await prisma.course.findUnique({
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
}
