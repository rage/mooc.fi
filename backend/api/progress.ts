import { Request } from "express"

import { Completion, Course } from "@prisma/client"

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

export function progress(ctx: ApiContext) {
  return async (req: Request<{ id: string }>, res: any) => {
    const { knex } = ctx
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: "must provide id" })
    }

    const getUserResult = await getUser(ctx)(req, res)

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
}

export function progressV2(ctx: ApiContext) {
  return async (req: Request<{ id: string }>, res: any) => {
    const { knex } = ctx
    const { id }: { id: string } = req.params
    const { deleted = "" } = req.query

    const includeDeleted = (deleted as string).toLowerCase().trim() === "true"

    if (!id) {
      return res.status(400).json({ message: "must provide id" })
    }

    const getUserResult = await getUser(ctx)(req, res)

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
}
