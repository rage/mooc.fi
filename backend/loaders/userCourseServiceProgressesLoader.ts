import DataLoader from "dataloader"

import { UserCourseServiceProgress } from "@prisma/client"

import { ExtendedPrismaClient } from "../prisma"

export interface UserCourseServiceProgressesKey {
  courseId: string
  userId: string
}

function serializeKey(key: UserCourseServiceProgressesKey): string {
  return JSON.stringify({
    courseId: key.courseId,
    userId: key.userId,
  })
}

export function createUserCourseServiceProgressesLoader(
  prisma: ExtendedPrismaClient,
) {
  return new DataLoader<
    UserCourseServiceProgressesKey,
    UserCourseServiceProgress[],
    string
  >(
    async (keys) => {
      const courseIds = [...new Set(keys.map((k) => k.courseId))]
      const userIds = [...new Set(keys.map((k) => k.userId))]

      const progresses = await prisma.userCourseServiceProgress.findMany({
        where: {
          course_id: { in: courseIds },
          user_id: { in: userIds },
        },
        distinct: ["course_id", "service_id", "user_id"],
        orderBy: { created_at: "asc" },
      })

      // Group by course_id and user_id
      const progressMap = new Map<string, UserCourseServiceProgress[]>()
      progresses.forEach((progress) => {
        const key = `${progress.course_id}:${progress.user_id}`
        const existing = progressMap.get(key) ?? []
        existing.push(progress)
        progressMap.set(key, existing)
      })

      return keys.map((key) => {
        const mapKey = `${key.courseId}:${key.userId}`
        return progressMap.get(mapKey) ?? []
      })
    },
    {
      cacheKeyFn: serializeKey,
    },
  )
}
