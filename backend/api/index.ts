import { asyncRouter } from "./asyncRouter"
import {
  abEnrollmentRouter,
  abStudiesRouter,
  CompletionController,
  CoursesHandoffController,
  CreditRegistrationHandoffController,
  ProgressController,
  PublicController,
  StoredDataController,
  UserCourseSettingsController,
} from "./routes"
import { ApiContext } from "./types"

export function apiRouter(ctx: ApiContext) {
  const completionController = new CompletionController(ctx)
  const coursesHandoffController = new CoursesHandoffController(ctx)
  const creditRegistrationHandoffController =
    new CreditRegistrationHandoffController(ctx)
  const progressController = new ProgressController(ctx)
  const storedDataController = new StoredDataController(ctx)
  const userCourseSettingsController = new UserCourseSettingsController(ctx)
  const publicController = new PublicController(ctx)

  return asyncRouter(ctx.logger)
    .get("/public/frontpage", publicController.frontpage)
    .get("/public/courses", publicController.courses)
    .get("/public/study-modules", publicController.studyModules)
    .get("/public/current-user", publicController.currentUser)
    .get("/completions/:slug", completionController.completions)
    .get(
      "/completions/:courseId/csv/token",
      completionController.completionsCSVToken,
    )
    .get("/completions/:courseId/csv", completionController.completionsCSV)
    .get("/completionTiers/:slug", completionController.completionTiers)
    .get(
      "/completionInstructions/:slug/:language",
      completionController.completionInstructions,
    )
    .post("/recheck-completion", completionController.recheckCompletion)
    .post("/register-completions", completionController.registerCompletions)
    .get(
      "/delegated-completions/:course_id/users/:upstream_id",
      completionController.delegatedCompletions,
    )
    .get("/delegated-courses/:course_id", completionController.delegatedCourse)
    .post("/courses-handoff/redeem", coursesHandoffController.redeem)
    .post("/courses-handoff/continue", coursesHandoffController.continue)
    .post(
      "/credit-registration-handoff/:slug",
      creditRegistrationHandoffController.create,
    )
    .post(
      "/completions/:slug/certificate",
      completionController.updateCertificateId,
    )
    .get("/progress/:idOrSlug", progressController.progress)
    .get("/progressv2/:idOrSlug", progressController.progressV2)
    .get("/tierprogress/:idOrSlug", progressController.tierProgress)
    .get("/tierProgress/:idOrSlug/:user_id", progressController.tierProgress)
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
