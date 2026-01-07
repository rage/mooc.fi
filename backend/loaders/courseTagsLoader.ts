import DataLoader from "dataloader"
import { uniqBy } from "lodash"

import { Tag, TagTranslation, TagType } from "@prisma/client"

import { ExtendedPrismaClient } from "../prisma"

export interface CourseTagsKey {
  courseId: string
  language?: string | null
  types?: string[] | null
  search?: string | null
  includeHidden?: boolean | null
}

type TagWithRelations = Tag & {
  tag_translations?: TagTranslation[] | null
  tag_types?: TagType[] | null
}

function serializeKey(key: CourseTagsKey): string {
  const sortedTypes = key.types ? [...key.types].sort() : null
  return JSON.stringify({
    courseId: key.courseId,
    language: key.language ?? null,
    types: sortedTypes,
    search: key.search ?? null,
    includeHidden: key.includeHidden ?? false,
  })
}

function makeTagFilter(key: CourseTagsKey) {
  return (tag: TagWithRelations) => {
    if (key.language) {
      const hasTranslation = tag.tag_translations?.some(
        (t: TagTranslation) => t.language === key.language,
      )
      if (!hasTranslation) return false
    }

    if (key.types) {
      const hasType = tag.tag_types?.some((t: TagType) =>
        key.types!.includes(t.name),
      )
      if (!hasType) return false
    }

    if (key.search) {
      const search = key.search.toLowerCase()
      const matchesSearch = tag.tag_translations?.some((t: TagTranslation) => {
        const nameMatch = t.name?.toLowerCase().includes(search) ?? false
        const descMatch = t.description?.toLowerCase().includes(search) ?? false
        return nameMatch || descMatch
      })
      if (!matchesSearch) return false
    }

    if (!key.includeHidden && tag.hidden === true) {
      return false
    }

    return true
  }
}

export function createCourseTagsLoader(prisma: ExtendedPrismaClient) {
  const batchLoadFn = async (keys: readonly CourseTagsKey[]) => {
    const courseIds = [...new Set(keys.map((k) => k.courseId))]

    const courses = await prisma.course.findMany({
      where: {
        id: { in: courseIds },
      },
      include: {
        tags: {
          include: {
            tag_translations: true,
            tag_types: true,
          },
        },
        handles_completions_for: {
          include: {
            tags: {
              include: {
                tag_translations: true,
                tag_types: true,
              },
            },
          },
        },
      },
    })

    const courseMap = new Map(courses.map((c) => [c.id, c]))

    return keys.map((key) => {
      const course = courseMap.get(key.courseId)
      if (!course) {
        return []
      }

      const filterTag = makeTagFilter(key)

      const courseTags = (course.tags ?? []).filter(filterTag)

      const handlesCompletionsForTags =
        course.handles_completions_for?.flatMap((c) => c.tags ?? []) ?? []

      const filteredHandlesTags = handlesCompletionsForTags.filter(filterTag)

      const tags = uniqBy(courseTags.concat(filteredHandlesTags), "id")

      return tags
    })
  }

  return new DataLoader<CourseTagsKey, Tag[], string>(batchLoadFn, {
    cacheKeyFn: serializeKey,
  })
}
