import { IncomingMessage } from "http"

import DataLoader from "dataloader"
import { Knex } from "knex"
import type { Logger } from "winston"

import {
  Organization,
  SponsorImage,
  SponsorTranslation,
  Tag,
  TagTranslation,
  User,
  UserCourseProgress,
  UserCourseServiceProgress,
} from "@prisma/client"

import { Role } from "./accessControl"
import { UserInfo } from "./domain/UserInfo"
import { CompletionLinkKey } from "./loaders/completionLinkLoader"
import { CourseSponsorsKey, LoadedCourseSponsor } from "./loaders/courseSponsorsLoader"
import { CourseTagsKey } from "./loaders/courseTagsLoader"
import { SponsorImagesKey } from "./loaders/sponsorImagesLoader"
import { SponsorTranslationsKey } from "./loaders/sponsorTranslationsLoader"
import { TagTranslationKey } from "./loaders/tagTranslationLoader"
import { UserCourseProgressKey } from "./loaders/userCourseProgressLoader"
import { UserCourseServiceProgressesKey } from "./loaders/userCourseServiceProgressesLoader"
import { ExtendedPrismaClient } from "./prisma"
import TmcClient from "./services/tmc"

export interface BaseContext {
  prisma: ExtendedPrismaClient
  logger: Logger
  knex: Knex
}

export interface Context extends BaseContext {
  user?: User
  organization?: Organization
  disableRelations: boolean
  role?: Role
  userDetails?: UserInfo
  tmcClient: TmcClient
  locale?: string
  req: IncomingMessage
  connectionParams?: Record<string, any>
  loaders: {
    courseTags: DataLoader<CourseTagsKey, Tag[], string>
    courseSponsors: DataLoader<CourseSponsorsKey, LoadedCourseSponsor[], string>
    sponsorTranslations: DataLoader<
      SponsorTranslationsKey,
      SponsorTranslation[],
      string
    >
    sponsorImages: DataLoader<SponsorImagesKey, SponsorImage[], string>
    tagTranslation: DataLoader<TagTranslationKey, TagTranslation | null, string>
    completionLink: DataLoader<CompletionLinkKey, string | null, string>
    userCourseProgress: DataLoader<
      UserCourseProgressKey,
      UserCourseProgress | null,
      string
    >
    userCourseServiceProgresses: DataLoader<
      UserCourseServiceProgressesKey,
      UserCourseServiceProgress[],
      string
    >
  }
}

export interface ServerContext extends BaseContext {
  extraContext?: Record<string, any>
}
