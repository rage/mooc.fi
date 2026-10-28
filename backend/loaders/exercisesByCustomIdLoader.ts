import DataLoader from "dataloader"

import { Exercise } from "@prisma/client"

import { ExtendedPrismaClient } from "../prisma"

/** First exercise with the given `custom_id`, across all courses. */
export function createExercisesByCustomIdLoader(prisma: ExtendedPrismaClient) {
  return new DataLoader<string, Exercise | null>(async (customIds) => {
    const exercises = await prisma.exercise.findMany({
      where: { custom_id: { in: [...customIds] } },
    })
    const byCustomId = new Map<string, Exercise>()
    for (const exercise of exercises) {
      if (exercise.custom_id && !byCustomId.has(exercise.custom_id)) {
        byCustomId.set(exercise.custom_id, exercise)
      }
    }

    return customIds.map((id) => byCustomId.get(id) ?? null)
  })
}
