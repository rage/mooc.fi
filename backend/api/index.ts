import type { PrismaClient } from "@prisma/client"
import { Knex } from "knex"
import { Router } from "express"

import {
  completions,
  completionTiers,
  completionInstructions,
} from "./completions"
import { userCourseSettingsCount } from "./userCourseSettingsCount"
import { progress, progressV2 } from "./progress"
import { tierProgress } from "./tierProgress"
import { registerCompletions } from "./registerCompletions"
import { getUser, updatePassword } from "./user"

import {
  userCourseSettingsGet,
  userCourseSettingsPost,
} from "./userCourseSettings"
import { abEnrollmentRouter, abStudiesRouter } from "./abStudio"

import * as winston from "winston"

export interface ApiContext {
  prisma: PrismaClient
  knex: Knex
  logger: winston.Logger
}

export function apiRouter(ctx: ApiContext) {
  return Router()
    .get("/completions/:course", completions(ctx))
    .get("/completionTiers/:id", completionTiers(ctx))
    .get("/completionInstructions/:id/:language", completionInstructions(ctx))
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
    .use("/ab-studies", abStudiesRouter(ctx))
    .get("/getUser/:course_id", getUser(ctx))
    .post("/updatePassword", updatePassword(ctx))
    .use("/ab-enrollments", abEnrollmentRouter(ctx))
}
