import { UserInputError } from "apollo-server-errors"
import { idArg, intArg, stringArg, arg } from "@nexus/schema"
import { schema } from "nexus"
import { isAdmin } from "../../../accessControl"

schema.extendType({
  type: "Query",
  definition(t) {
    t.field("userCourseProgress", {
      type: "UserCourseProgress",
      args: {
        user_id: idArg({ required: true }),
        course_id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, args, ctx) => {
        const { user_id, course_id } = args
        const result = await ctx.db.userCourseProgress.findMany({
          where: {
            user_id,
            course_id,
          },
        })

        if (!result.length) throw new UserInputError("Not found")

        return result[0]
      },
    })

    // FIXME: (?) broken until the nexus json thing is fixed or smth

    /*t.crud.userCourseProgresses({
      filtering: {
        user: true,
        course_courseTouser_course_progress: true,
      },
      pagination: true,
    })*/

    t.list.field("userCourseProgresses", {
      type: "UserCourseProgress",
      args: {
        user_id: idArg(),
        course_slug: stringArg(),
        course_id: idArg(),
        skip: intArg(),
        take: intArg(),
        cursor: arg({ type: "UserCourseProgressWhereUniqueInput" }),
      },
      authorize: isAdmin,
      resolve: (_, args, ctx) => {
        const { skip, take, cursor, user_id, course_id, course_slug } = args

        return ctx.db.userCourseProgress.findMany({
          skip: skip ?? undefined,
          take: take ?? undefined,
          cursor: cursor ? { id: cursor.id ?? undefined } : undefined,
          /*first: first ?? undefined,
          last: last ?? undefined,
          before: before ? { id: before } : undefined,
          after: after ? { id: after } : undefined,*/
          where: {
            user_id,
            course: {
              OR: [
                {
                  id: course_id ?? undefined,
                },
                {
                  slug: course_slug ?? undefined,
                },
              ],
            },
          },
        })
      },
    })
  },
})
