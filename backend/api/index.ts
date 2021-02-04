import { Express } from "express"
import type { PrismaClient } from "@prisma/client"
import type Knex from "knex"
import { Router } from "express"

import { completions } from "./completions"
import { userCourseSettingsCount } from "./userCourseSettingsCount"
import { progress, progressV2 } from "./progress"
import { tierProgress } from "./tierProgress"
import { registerCompletions } from "./registerCompletions"

export interface ApiContext {
  prisma: PrismaClient
  knex: Knex
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
}
