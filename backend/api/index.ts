import { Router } from "express"
import { Knex } from "knex"
import * as winston from "winston"

import type { PrismaClient } from "@prisma/client"

import { abEnrollmentRouter, abStudiesRouter } from "./abStudio"
import {
  completionInstructions,
  completions,
  completionTiers,
  recheckCompletion,
} from "./completions"
import { progress, progressV2 } from "./progress"
import { registerCompletions } from "./registerCompletions"
import { getStoredData, postStoredData } from "./storedData"
import { tierProgress } from "./tierProgress"
import {
  connectUser,
  getUser,
  registerUser,
  updatePassword,
  updatePersonAffiliation,
  updateUser,
} from "./user"
import { userCourseProgress } from "./userCourseProgress"
import {
  userCourseSettingsGet,
  userCourseSettingsPost,
} from "./userCourseSettings"
import { userCourseSettingsCount } from "./userCourseSettingsCount"

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
    .get("/getUser/:course_id", getUser(ctx)) // TODO: find better name for this
    .post("/updatePassword", updatePassword(ctx))
    .use("/ab-enrollments", abEnrollmentRouter(ctx))
    .post("/user/register", registerUser(ctx))
    .get("/user-course-progress/:slug", userCourseProgress(ctx))
    .patch("/user", updateUser(ctx))
    .post("/user/update-person-affiliation", updatePersonAffiliation(ctx))
    .post("/user/connect", connectUser(ctx))
    .post("/stored-data/:slug", postStoredData(ctx))
    .get("/stored-data/:slug", getStoredData(ctx))
    .post("/recheck-completion", recheckCompletion(ctx))
}
