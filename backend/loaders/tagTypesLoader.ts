import DataLoader from "dataloader"

import { TagType } from "@prisma/client"

import { ExtendedPrismaClient } from "../prisma"

export interface TagTypesKey {
  tagId: string
}

function serializeKey(key: TagTypesKey): string {
  return key.tagId
}

export function createTagTypesLoader(prisma: ExtendedPrismaClient) {
  return new DataLoader<TagTypesKey, TagType[], string>(
    async (keys) => {
      const tagIds = [...new Set(keys.map((k) => k.tagId))]

      const tagTypes = await prisma.tagType.findMany({
        where: {
          tags: {
            some: {
              id: { in: tagIds },
            },
          },
        },
        include: {
          tags: {
            where: {
              id: { in: tagIds },
            },
            select: {
              id: true,
            },
          },
        },
      })

      const typesByTag = new Map<string, TagType[]>()
      tagTypes.forEach((type) => {
        type.tags?.forEach((tag) => {
          const existing = typesByTag.get(tag.id) ?? []
          existing.push(type)
          typesByTag.set(tag.id, existing)
        })
      })

      return keys.map((key) => typesByTag.get(key.tagId) ?? [])
    },
    {
      cacheKeyFn: serializeKey,
    },
  )
}
