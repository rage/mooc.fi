import {
  arg,
  booleanArg,
  extendType,
  idArg,
  list,
  nonNull,
  nullable,
  stringArg,
} from "nexus"
import { UserInputError } from "apollo-server-core"
import { isAdmin, isUser, or, Role } from "../../accessControl"
import { filterNull } from "../../util/db-functions"
import { Course, CourseTranslation, Prisma } from "@prisma/client"
import { omit } from "lodash"
import { notEmpty } from "../../util/notEmpty"

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

        const courseQuery: Prisma.FindUniqueCourseArgs = {
          where: {
            slug: slug ?? undefined,
            id: id ?? undefined,
          },
        }

        if (ctx.role !== Role.ADMIN) {
          courseQuery.select = {
            id: true,
            slug: true,
            name: true,
          }
        }

        const course: Course | null = await ctx.prisma.course.findUnique(
          courseQuery,
        )

        if (!course) {
          throw new Error("course not found")
        }

        let description = ""
        let link = ""
        let name = course.name

        if (language) {
          const course_translation = await ctx.prisma.courseTranslation.findFirst(
            {
              where: {
                course_id: course.id,
                language,
              },
            },
          )

          if (!course_translation) {
            return Promise.resolve(null)
          }

          description = course_translation.description ?? ""
          link = course_translation.link ?? ""
          name = course_translation.name
        }

        return {
          ...course,
          name,
          description,
          link,
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
        search: nullable(stringArg()),
        hidden: nullable(booleanArg({ default: true })),
        handledBy: nullable(stringArg()),
        status: nullable(list(nonNull(arg({ type: "CourseStatus" })))),
      },
      resolve: async (_, args, ctx) => {
        const { orderBy, language, search, hidden, handledBy, status } = args

        const searchQuery: Prisma.Enumerable<Prisma.CourseWhereInput> = []

        if (search) {
          searchQuery.push({
            OR: [
              ...[
                "name",
                "slug",
                "teacher_in_charge_name",
                "teacher_in_charge_email",
                "support_email",
              ].map((field) => ({
                [field]: { contains: search, mode: "insensitive" },
              })),
              {
                course_translations: {
                  some: {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              },
            ],
          })
        }
        if (!hidden) {
          searchQuery.push({
            OR: [
              {
                hidden: false,
              },
              {
                hidden: null,
              },
            ],
          })
        }
        if (handledBy) {
          searchQuery.push({
            completions_handled_by: { slug: handledBy },
          })
        }
        if (status?.length) {
          searchQuery.push({
            status: { in: status },
          })
        }

        const courses: (Course & {
          course_translations?: CourseTranslation[]
        })[] = await ctx.prisma.course.findMany({
          orderBy:
            (filterNull(orderBy) as Prisma.CourseOrderByInput) ?? undefined,
          where: {
            AND: searchQuery,
          },
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

        const filtered = courses
          .map((course) => {
            if (language && !course.course_translations?.length) {
              return null
            }
            return {
              ...omit(course, "course_translations"),
              description: course?.course_translations?.[0]?.description ?? "",
              link: course?.course_translations?.[0]?.link ?? "",
            }
          })
          .filter(notEmpty)

        // TODO: (?) provide proper typing
        return filtered as (Course & { description: string; link: string })[]
      },
    })

    t.list.field("handlerCourses", {
      type: "Course",
      authorize: isAdmin,
      resolve: async (_, __, ctx) => {
        return ctx.prisma.course.findMany({
          where: {
            handles_completions_for: {
              some: {},
            },
          },
        })
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
