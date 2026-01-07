import DataLoader from "dataloader"

import { UserCourseProgress } from "@prisma/client"

import { ExtendedPrismaClient } from "../prisma"

export interface UserCourseProgressKey {
  courseId: string
  userId: string
}

function serializeKey(key: UserCourseProgressKey): string {
  return JSON.stringify({
    courseId: key.courseId,
    userId: key.userId,
  })
}

export function createUserCourseProgressLoader(prisma: ExtendedPrismaClient) {
  return new DataLoader<
    UserCourseProgressKey,
    UserCourseProgress | null,
    string
  >(
    async (keys) => {
      const courseIds = [...new Set(keys.map((k) => k.courseId))]
      const userIds = [...new Set(keys.map((k) => k.userId))]

      const progresses = await prisma.userCourseProgress.findMany({
        where: {
          course_id: { in: courseIds },
          user_id: { in: userIds },
        },
        orderBy: { created_at: "asc" },
      })

      // Group by course_id and user_id, take the first one for each
      const progressMap = new Map<string, UserCourseProgress>()
      progresses.forEach((progress) => {
        const key = `${progress.course_id}:${progress.user_id}`
        if (!progressMap.has(key)) {
          progressMap.set(key, progress)
        }
      })

      return keys.map((key) => {
        const mapKey = `${key.courseId}:${key.userId}`
        return progressMap.get(mapKey) ?? null
      })
    },
    {
      cacheKeyFn: serializeKey,
    },
  )
}
