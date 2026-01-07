import DataLoader from "dataloader"

import { SponsorImage } from "@prisma/client"

import { ExtendedPrismaClient } from "../prisma"

export interface SponsorImagesKey {
  sponsorId: string
  type?: string | null
  minWidth?: number | null
  minHeight?: number | null
  maxWidth?: number | null
  maxHeight?: number | null
}

function serializeKey(key: SponsorImagesKey): string {
  return JSON.stringify({
    sponsorId: key.sponsorId,
    type: key.type ?? null,
    minWidth: key.minWidth ?? null,
    minHeight: key.minHeight ?? null,
    maxWidth: key.maxWidth ?? null,
    maxHeight: key.maxHeight ?? null,
  })
}

export function createSponsorImagesLoader(prisma: ExtendedPrismaClient) {
  return new DataLoader<SponsorImagesKey, SponsorImage[], string>(
    async (keys) => {
      const sponsorIds = [...new Set(keys.map((k) => k.sponsorId))]

      const images = await prisma.sponsorImage.findMany({
        where: {
          sponsor_id: { in: sponsorIds },
        },
      })

      const imagesBySponsor = new Map<string, typeof images>()
      images.forEach((img) => {
        const existing = imagesBySponsor.get(img.sponsor_id) ?? []
        existing.push(img)
        imagesBySponsor.set(img.sponsor_id, existing)
      })

      return keys.map((key) => {
        const allImages = imagesBySponsor.get(key.sponsorId) ?? []

        return allImages.filter((img) => {
          if (key.type && img.type !== key.type) {
            return false
          }
          if (key.minWidth && img.width < key.minWidth) {
            return false
          }
          if (key.maxWidth && img.width > key.maxWidth) {
            return false
          }
          if (key.minHeight && img.height < key.minHeight) {
            return false
          }
          if (key.maxHeight && img.height > key.maxHeight) {
            return false
          }
          return true
        })
      })
    },
    {
      cacheKeyFn: serializeKey,
    },
  )
}
