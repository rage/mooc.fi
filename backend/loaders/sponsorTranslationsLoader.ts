import DataLoader from "dataloader"

import { SponsorTranslation } from "@prisma/client"

import { ExtendedPrismaClient } from "../prisma"

export interface SponsorTranslationsKey {
  sponsorId: string
  language?: string | null
}

function serializeKey(key: SponsorTranslationsKey): string {
  return JSON.stringify({
    sponsorId: key.sponsorId,
    language: key.language ?? null,
  })
}

export function createSponsorTranslationsLoader(prisma: ExtendedPrismaClient) {
  return new DataLoader<SponsorTranslationsKey, SponsorTranslation[], string>(
    async (keys) => {
      const sponsorIds = [...new Set(keys.map((k) => k.sponsorId))]

      const translations = await prisma.sponsorTranslation.findMany({
        where: {
          sponsor_id: { in: sponsorIds },
        },
      })

      const translationsBySponsor = new Map<string, typeof translations>()
      translations.forEach((t) => {
        const existing = translationsBySponsor.get(t.sponsor_id) ?? []
        existing.push(t)
        translationsBySponsor.set(t.sponsor_id, existing)
      })

      return keys.map((key) => {
        const allTranslations = translationsBySponsor.get(key.sponsorId) ?? []

        if (key.language) {
          return allTranslations.filter((t) => t.language === key.language)
        }

        return allTranslations
      })
    },
    {
      cacheKeyFn: serializeKey,
    },
  )
}
