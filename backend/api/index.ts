import type { PrismaClient } from "@prisma/client"
import { Router } from "express"
import { Knex } from "knex"
import * as winston from "winston"

import { abEnrollmentRouter, abStudiesRouter } from "./abStudio"
import { CompletionController } from "./completions"
import { ProgressController } from "./progress"
import { StoredDataController } from "./storedData"
import { UserCourseSettingsController } from "./userCourseSettings"

export interface ApiContext {
  prisma: PrismaClient
  knex: Knex
  logger: winston.Logger
}

export function apiRouter(ctx: ApiContext) {
  const completionController = new CompletionController(ctx)
  const progressController = new ProgressController(ctx)
  const storedDataController = new StoredDataController(ctx)
  const userCourseSettingsController = new UserCourseSettingsController(ctx)

  return Router()
    .get("/completions/:slug", completionController.completions)
    .get("/completionTiers/:slug", completionController.completionTiers)
    .get(
      "/completionInstructions/:slug/:language",
      completionController.completionInstructions,
    )
    .post("/recheck-completion", completionController.recheckCompletion)
    .post("/register-completions", completionController.registerCompletions)
    .get("/progress/:id", progressController.progress)
    .get("/progressv2/:id", progressController.progressV2)
    .get("/tierprogress/:id", progressController.tierProgress)
    .get("/user-course-progress/:slug", progressController.userCourseProgress)
    .get("/user-course-settings/:slug", userCourseSettingsController.get)
    .post("/user-course-settings/:slug", userCourseSettingsController.post)
    .get(
      "/usercoursesettingscount/:slug/:language",
      userCourseSettingsController.count,
    )
    .use("/ab-studies", abStudiesRouter(ctx))
    .use("/ab-enrollments", abEnrollmentRouter(ctx))
    .get("/stored-data/:slug", storedDataController.get)
    .post("/stored-data/:slug", storedDataController.post)
}
