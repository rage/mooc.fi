import DataLoader from "dataloader"
import { groupBy } from "lodash"

import { ExtendedPrismaClient } from "../prisma"

export interface ExerciseProgressKey {
  courseId: string
  userId: string
}

export interface ExerciseProgressRow {
  exercise_id: string
  exercise_completion_id: string | null
  completed: boolean | null
  attempted: boolean | null
}

type BatchRow = ExerciseProgressRow & { course_id: string; user_id: string }

const pairKey = (courseId: string, userId: string) => `${courseId}:${userId}`

/** Latest completion per non-deleted exercise of a course, for each (course, user) pair. */
export function createExerciseProgressLoader(prisma: ExtendedPrismaClient) {
  return new DataLoader<ExerciseProgressKey, ExerciseProgressRow[], string>(
    async (keys) => {
      const rows = await prisma.$queryRaw<BatchRow[]>`
        select k.course_id,
               k.user_id,
               e.id as exercise_id,
               ec.id as exercise_completion_id,
               ec.completed,
               ec.attempted
          from unnest(
            ${keys.map((k) => k.courseId)}::uuid[],
            ${keys.map((k) => k.userId)}::uuid[]
          ) as k(course_id, user_id)
          join exercise e on e.course_id = k.course_id and e.deleted <> true
          left join lateral (
            select id, completed, attempted
              from exercise_completion
             where user_id = k.user_id and exercise_id = e.id
             order by timestamp desc, updated_at desc
             limit 1
          ) ec on true
      `

      const byPair = groupBy(rows, (row) => pairKey(row.course_id, row.user_id))

      return keys.map((k) =>
        (byPair[pairKey(k.courseId, k.userId)] ?? []).map(
          ({ course_id, user_id, ...row }) => row,
        ),
      )
    },
    { cacheKeyFn: (k) => pairKey(k.courseId, k.userId) },
  )
}
