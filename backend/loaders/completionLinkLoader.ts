import DataLoader from "dataloader"

import { ExtendedPrismaClient } from "../prisma"

export interface CompletionLinkKey {
  courseId: string
  language?: string | null
}

function serializeKey(key: CompletionLinkKey): string {
  return JSON.stringify({
    courseId: key.courseId,
    language: key.language ?? null,
  })
}

export function createCompletionLinkLoader(prisma: ExtendedPrismaClient) {
  return new DataLoader<CompletionLinkKey, string | null, string>(
    async (keys) => {
      const courseIds = [...new Set(keys.map((k) => k.courseId))]

      // Fetch all links for the courses
      const links = await prisma.openUniversityRegistrationLink.findMany({
        where: {
          course_id: { in: courseIds },
        },
        orderBy: {
          created_at: "asc",
        },
      })

      // Group links by course_id and language
      const linkMap = new Map<string, string | null>()
      keys.forEach((key) => {
        const courseLinks = links.filter(
          (link) => link.course_id === key.courseId,
        )

        if (courseLinks.length === 0) {
          linkMap.set(`${key.courseId}:${key.language ?? "null"}`, null)
          return
        }

        // Filter by language if provided
        const filteredLinks =
          key.language && key.language !== "unknown"
            ? courseLinks.filter((link) => link.language === key.language)
            : courseLinks

        // Return the first link (or null if none match)
        const link = filteredLinks.length > 0 ? filteredLinks[0].link : null
        linkMap.set(`${key.courseId}:${key.language ?? "null"}`, link)
      })

      return keys.map((key) => {
        const mapKey = `${key.courseId}:${key.language ?? "null"}`
        return linkMap.get(mapKey) ?? null
      })
    },
    {
      cacheKeyFn: serializeKey,
    },
  )
}
