import { omit } from "lodash"
import { arg, objectType, stringArg } from "nexus"

import { Course, CourseTranslation, Prisma } from "@prisma/client"

import { filterNull } from "../../util/db-functions"

export const StudyModule = objectType({
  name: "StudyModule",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.image()
    t.model.name()
    t.model.order()
    t.model.slug()
    t.model.updated_at()
    t.model.study_module_translations()

    // @ts-ignore: false error
    t.string("description")

    t.list.field("courses", {
      type: "Course",
      args: {
        orderBy: arg({ type: "CourseOrderByInput" }),
        language: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        const { language, orderBy } = args

        const courses: (Course & {
          course_translations?: CourseTranslation[]
        })[] = await ctx.prisma.studyModule
          .findUnique({
            where: { id: parent.id },
          })
          .courses({
            orderBy:
              (filterNull(orderBy) as Prisma.CourseOrderByInput) ?? undefined,
            ...(language
              ? {
                  include: {
                    course_translations: {
                      where: {
                        language: { equals: language },
                      },
                    },
                  },
                }
              : {}),
          })

        const coursesWithDescriptionAndLink = courses.map((course) => ({
          ...omit(course, "course_translations"),
          description: course?.course_translations?.[0]?.description ?? "",
          link: course?.course_translations?.[0]?.link ?? "",
        }))

        return coursesWithDescriptionAndLink
      },
    })
  },
})
