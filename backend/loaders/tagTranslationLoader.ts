import DataLoader from "dataloader"

import { TagTranslation } from "@prisma/client"

import { ExtendedPrismaClient } from "../prisma"

export interface TagTranslationKey {
  tagId: string
  language: string
}

function serializeKey(key: TagTranslationKey): string {
  return JSON.stringify({
    tagId: key.tagId,
    language: key.language,
  })
}

export function createTagTranslationLoader(prisma: ExtendedPrismaClient) {
  return new DataLoader<TagTranslationKey, TagTranslation | null, string>(
    async (keys) => {
      const tagIds = [...new Set(keys.map((k) => k.tagId))]
      const languages = [...new Set(keys.map((k) => k.language))]

      const translations = await prisma.tagTranslation.findMany({
        where: {
          tag_id: { in: tagIds },
          language: { in: languages },
        },
      })

      const translationMap = new Map<string, TagTranslation>()
      translations.forEach((t) => {
        const key = `${t.tag_id}:${t.language}`
        translationMap.set(key, t)
      })

      return keys.map((key) => {
        const mapKey = `${key.tagId}:${key.language}`
        return translationMap.get(mapKey) ?? null
      })
    },
    {
      cacheKeyFn: serializeKey,
    },
  )
}
