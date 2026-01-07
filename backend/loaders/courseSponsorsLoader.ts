import DataLoader from "dataloader"

import { Sponsor } from "@prisma/client"

import { ExtendedPrismaClient } from "../prisma"

export interface CourseSponsorsKey {
  courseId: string
  language?: string | null
}

export type LoadedCourseSponsor = Sponsor & { order: number; language?: string }

function serializeKey(key: CourseSponsorsKey): string {
  return JSON.stringify({
    courseId: key.courseId,
    language: key.language ?? null,
  })
}

export function createCourseSponsorsLoader(prisma: ExtendedPrismaClient) {
  return new DataLoader<CourseSponsorsKey, LoadedCourseSponsor[], string>(
    async (keys) => {
      const courseIds = [...new Set(keys.map((k) => k.courseId))]

      const courseSponsors = await prisma.courseSponsor.findMany({
        where: {
          course_id: { in: courseIds },
        },
        include: {
          sponsor: {
            include: {
              translations: true,
            },
          },
        },
      })

      const sponsorsByCourse = new Map<string, typeof courseSponsors>()
      courseSponsors.forEach((cs) => {
        const existing = sponsorsByCourse.get(cs.course_id) ?? []
        existing.push(cs)
        sponsorsByCourse.set(cs.course_id, existing)
      })

      return keys.map((key) => {
        const sponsors = sponsorsByCourse.get(key.courseId) ?? []

        const filteredSponsors = key.language
          ? sponsors.filter((cs) =>
              cs.sponsor.translations.some((t) => t.language === key.language),
            )
          : sponsors

        return filteredSponsors.map(({ sponsor, order }) => ({
          ...sponsor,
          order: order ?? 0,
          language: key.language ?? undefined,
        }))
      })
    },
    {
      cacheKeyFn: serializeKey,
    },
  )
}
