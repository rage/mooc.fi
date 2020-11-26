import { arg, extendType, idArg, nonNull, stringArg } from "@nexus/schema"
import { UserInputError } from "apollo-server-core"
import { isAdmin, isUser, or, Role } from "../../accessControl"
import { filterNull } from "../../util/db-functions"
import { Course, CourseTranslation, Prisma } from "@prisma/client"
import { omit } from "lodash"

export const CourseQueries = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("course", {
      type: "Course",
      args: {
        slug: stringArg(),
        id: idArg(),
        language: stringArg(),
      },
      authorize: or(isAdmin, isUser),
      resolve: async (_, args, ctx) => {
        const { slug, id, language } = args

        if (!slug && !id) {
          throw new UserInputError("must provide id or slug")
        }

        const course:
          | (Course & { course_translations?: CourseTranslation[] })
          | null = await ctx.prisma.course.findUnique({
          where: {
            slug: slug ?? undefined,
            id: id ?? undefined,
          },
          ...(ctx.role !== Role.ADMIN
            ? {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                },
              }
            : {}),
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

        if (!course) {
          throw new Error("course not found")
        }

        if (language) {
          const course_translation = course.course_translations?.[0]

          if (!course_translation) {
            return Promise.resolve(null)
          }

          // TODO/FIXME: provide language instead of getting the first one
          const { name, description, link = "" } = course_translation
          return {
            ...course,
            name,
            description,
            link,
          }
        }

        return {
          ...course,
          description: "",
          link: "",
        }
      },
    })

    t.crud.courses({
      ordering: true,
    })

    t.list.field("courses", {
      type: "Course",
      args: {
        orderBy: arg({ type: "CourseOrderByInput" }),
        language: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const { orderBy, language } = args

        const courses: (Course & {
          course_translations?: CourseTranslation[]
        })[] = await ctx.prisma.course.findMany({
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

        const filtered = courses.map((course) => ({
          ...omit(course, "course_translations"),
          description: course?.course_translations?.[0]?.description ?? "",
          link: course?.course_translations?.[0]?.link ?? "",
        }))

        // TODO: (?) provide proper typing
        return filtered as (Course & { description: string; link: string })[]
      },
    })

    t.field("course_exists", {
      type: "Boolean",
      args: {
        slug: nonNull(stringArg()),
      },
      authorize: or(isAdmin, isUser),
      resolve: async (_, args, ctx) => {
        const { slug } = args

        return Boolean(
          await ctx.prisma.course.findFirst({
            where: { slug },
            select: { id: true },
          }),
        )
      },
    })
  },
})
