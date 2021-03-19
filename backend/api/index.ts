import type { PrismaClient } from "@prisma/client"
import type Knex from "knex"
import { Router } from "express"

import { completions } from "./completions"
import { userCourseSettingsCount } from "./userCourseSettingsCount"
import { progress, progressV2 } from "./progress"
import { tierProgress } from "./tierProgress"
import { registerCompletions } from "./registerCompletions"
import {
  userCourseSettingsGet,
  userCourseSettingsPost,
} from "./userCourseSettings"
import { abEnrollmentPost, abStudyGet, abStudyPost } from "./abStudio"

import * as winston from "winston"

export interface ApiContext {
  prisma: PrismaClient
  knex: Knex
  logger: winston.Logger
}

export function apiRouter(ctx: ApiContext) {
  return Router()
    .get("/completions/:course", completions(ctx))
    .get("/progress/:id", progress(ctx))
    .get("/progressv2/:id", progressV2(ctx))
    .post("/register-completions", registerCompletions(ctx))
    .get("/tierprogress/:id", tierProgress(ctx))
    .get(
      "/usercoursesettingscount/:course/:language",
      userCourseSettingsCount(ctx),
    )
    .get("/user-course-settings/:slug", userCourseSettingsGet(ctx))
    .post("/user-course-settings/:slug", userCourseSettingsPost(ctx))
    .get("/ab-studies/:id", abStudyGet(ctx))
    .get("/ab-studies", abStudyGet(ctx))
    .post("/ab-studies", abStudyPost(ctx))
    .post("/ab-enrollment", abEnrollmentPost(ctx))
}
