import DataLoader from "dataloader"

import { Prisma } from "@prisma/client"

import { ExtendedPrismaClient } from "../prisma"

/** `extra` JSON of user course progresses, keyed by progress id. */
export function createUserCourseProgressExtraLoader(
  prisma: ExtendedPrismaClient,
) {
  return new DataLoader<string, Prisma.JsonValue | null>(async (ids) => {
    const progresses = await prisma.userCourseProgress.findMany({
      where: { id: { in: [...ids] } },
      select: { id: true, extra: true },
    })
    const extraById = new Map(progresses.map((p) => [p.id, p.extra]))

    return ids.map((id) => extraById.get(id) ?? null)
  })
}
