import { ExtendedPrismaClient } from "../prisma"
import { createCompletionLinkLoader } from "./completionLinkLoader"
import { createCourseSponsorsLoader } from "./courseSponsorsLoader"
import { createCourseTagsLoader } from "./courseTagsLoader"
import { createSponsorImagesLoader } from "./sponsorImagesLoader"
import { createSponsorTranslationsLoader } from "./sponsorTranslationsLoader"
import { createTagTranslationLoader } from "./tagTranslationLoader"
import { createUserCourseProgressLoader } from "./userCourseProgressLoader"
import { createUserCourseServiceProgressesLoader } from "./userCourseServiceProgressesLoader"

export function createLoaders(prisma: ExtendedPrismaClient) {
  return {
    courseTags: createCourseTagsLoader(prisma),
    courseSponsors: createCourseSponsorsLoader(prisma),
    sponsorTranslations: createSponsorTranslationsLoader(prisma),
    sponsorImages: createSponsorImagesLoader(prisma),
    tagTranslation: createTagTranslationLoader(prisma),
    completionLink: createCompletionLinkLoader(prisma),
    userCourseProgress: createUserCourseProgressLoader(prisma),
    userCourseServiceProgresses:
      createUserCourseServiceProgressesLoader(prisma),
  }
}
