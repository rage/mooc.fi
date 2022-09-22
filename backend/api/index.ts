import { Router } from "express"

import {
  abEnrollmentRouter,
  abStudiesRouter,
  CompletionController,
  ProgressController,
  StoredDataController,
  UserCourseSettingsController,
} from "./routes"
import { ApiContext } from "./types"

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
    .get("/progress/:idOrSlug", progressController.progress)
    .get("/progressv2/:idOrSlug", progressController.progressV2)
    .get("/tierprogress/:idOrSlug", progressController.tierProgress)
    .get(
      "/recheck-bai-progresses",
      progressController.recheckBAIUserCourseProgresses,
    )
    .get("/user-course-progress/:slug", progressController.userCourseProgress)
    .get("/user-course-settings/:slug", userCourseSettingsController.get)
    .post("/user-course-settings/:slug", userCourseSettingsController.post)
    .get(
      "/usercoursesettingscount/:slug/:language",
      userCourseSettingsController.count,
    )
    .use("/ab-studies", abStudiesRouter(ctx))
    .use("/ab-enrollments", abEnrollmentRouter(ctx))
    .get("/temporary-stored-data/:slug", storedDataController.get)
    .post("/temporary-stored-data/:slug", storedDataController.post)
}
