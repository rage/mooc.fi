import { arg, extendType, idArg, stringArg } from "@nexus/schema"
import { UserInputError } from "apollo-server-core"
import { isAdmin, isUser, or, Role } from "../../accessControl"
import { filterNull } from "../../util/db-functions"
import { Course } from "@prisma/client"

export const CourseQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("course", {
      type: "Course",
      args: {
        slug: stringArg(),
        id: idArg(),
        language: stringArg(),
      },
      authorize: or(isAdmin, isUser),
      nullable: true,
      resolve: async (_, args, ctx) => {
        const { slug, id, language } = args

        if (!slug && !id) {
          throw new UserInputError("must provide id or slug")
        }

        const course = await ctx.prisma.course.findOne({
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
        })

        if (!course) {
          throw new Error("course not found")
        }

        if (language) {
          const course_translations = await ctx.prisma.courseTranslation.findMany(
            {
              where: {
                course_id: course.id,
                language,
              },
            },
          )

          if (!course_translations.length) {
            return Promise.resolve(null)
          }

          // TODO/FIXME: provide language instead of getting the first one
          const { name, description, link = "" } = course_translations[0]
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

        const courses = await ctx.prisma.course.findMany({
          orderBy: filterNull(orderBy) ?? undefined,
        })

        const filtered = language
          ? (
              await Promise.all(
                courses.map(async (course: Course) => {
                  const course_translations = await ctx.prisma.courseTranslation.findMany(
                    {
                      where: {
                        course_id: course.id,
                        language,
                      },
                    },
                  )

                  if (!course_translations.length) {
                    return Promise.resolve(null)
                  }

                  const {
                    name,
                    description,
                    link = "",
                  } = course_translations[0]

                  return { ...course, name, description, link }
                }),
              )
            ).filter((v) => !!v)
          : await Promise.all(
              courses.map((course: Course) => ({
                ...course,
                description: "",
                link: "",
              })),
            )

        // TODO: (?) provide proper typing
        return filtered as (Course & { description: string; link: string })[]
      },
    })

    t.field("course_exists", {
      type: "Boolean",
      args: {
        slug: stringArg({ required: true }),
      },
      authorize: or(isAdmin, isUser),
      resolve: async (_, args, ctx) => {
        const { slug } = args

        return (
          (
            await ctx.prisma.course.findMany({
              where: { slug },
              select: { id: true },
            })
          ).length > 0
        )
      },
    })
  },
})
