import { Prisma } from "../../generated/prisma-client"
import { idArg, arg, floatArg } from "@nexus/schema"
import checkAccess from "../../accessControl"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const addUserCourseProgress = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("addUserCourseProgress", {
    type: "user_course_progress",
    args: {
      user_id: idArg({ required: true }),
      course_id: idArg({ required: true }),
      progress: arg({ type: "PointsByGroup", required: true }),
      max_points: floatArg(),
      n_points: floatArg(),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx)
      const { user_id, course_id, progress, max_points, n_points } = args
      const prisma: Prisma = ctx.prisma
      return prisma.createUserCourseProgress({
        user: { connect: { id: user_id } },
        course: { connect: { id: course_id } },
        progress: progress,
        max_points,
        n_points,
      })
    },
  })
}

const addUserCourseProgressMutations = (
  t: ObjectDefinitionBlock<"Mutation">,
) => {
  addUserCourseProgress(t)
}

export default addUserCourseProgressMutations
