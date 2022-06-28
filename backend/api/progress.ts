import { Completion, Course, UserCourseProgress } from "@prisma/client"
import { Request, Response } from "express"

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

    const exercise_completions = await knex
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
      .from("exercise_completion")
      .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
      .where("exercise.course_id", id)
      .andWhere("exercise_completion.user_id", user.id)

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
    req: Request<{ id: string }, {}, {}, { deleted?: string }>,
    res: Response,
  ) => {
    const { knex } = this.ctx
    const { id } = req.params
    const { deleted = "" } = req.query

    const includeDeleted = deleted.toLowerCase().trim() === "true"

    if (!id) {
      return res.status(400).json({ message: "must provide id" })
    }

    const getUserResult = await getUser(this.ctx)(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const exerciseCompletionsPromise = knex
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
      .from("exercise_completion")
      .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
      .where("exercise.course_id", id)
      .andWhere("exercise_completion.user_id", user.id)

    if (!includeDeleted) {
      exerciseCompletionsPromise.andWhereNot("exercise.deleted", true)
    }

    const exercise_completions = await exerciseCompletionsPromise
    const course = (
      await knex
        .select<any, Course[]>("*")
        .from("course")
        .where("id", id)
        .limit(1)
    )?.[0]

    const completions = await knex
      .select<any, Completion[]>("*")
      .from("completion")
      .where("course_id", course?.completions_handled_by_id ?? course?.id)
      .andWhere("user_id", user.id)

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
        course_id: id,
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
