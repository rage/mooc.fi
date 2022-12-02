import { UserInputError } from "apollo-server-express"
import { omit } from "lodash"
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

import { Course, CourseTag, CourseTranslation, Prisma } from "@prisma/client"

import { isAdmin, isUser, or, Role } from "../../accessControl"
import { filterNull, getCourseOrAlias } from "../../util/db-functions"
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
        translationFallback: booleanArg({ default: false }),
      },
      authorize: or(isAdmin, isUser),
      resolve: async (_, args, ctx) => {
        const { slug, id, language, translationFallback } = args

        if (!slug && !id) {
          throw new UserInputError("must provide id or slug")
        }

        const courseQuery: Prisma.CourseFindUniqueArgs = {
          where: {
            slug: slug ?? undefined,
            id: id ?? undefined,
          },
          // TODO: limit these in the model
          ...(ctx.role !== Role.ADMIN && {
            select: {
              id: true,
              slug: true,
              name: true,
            },
          }),
        }

        const course = await getCourseOrAlias(ctx)(courseQuery)

        if (!course) {
          throw new Error("course not found")
        }

        const returnedCourse = {
          ...course,
          description: "",
          link: "",
        } as any

        if (language) {
          const course_translation = (
            await ctx.prisma.course
              .findUnique({
                where: {
                  id: course.id,
                },
              })
              .course_translations({
                where: {
                  language,
                },
                take: 1,
              })
          )?.[0]

          if (!course_translation) {
            if (!translationFallback) {
              return Promise.resolve(null)
            }
          } else {
            returnedCourse.description = course_translation.description ?? ""
            returnedCourse.link = course_translation.link ?? ""
            returnedCourse.name = course_translation.name
          }

          const course_tags = await ctx.prisma.course
            .findUnique({
              where: {
                id: course.id,
              },
            })
            .course_tags({
              where: {
                tag: {
                  tag_translations: {
                    some: {
                      language,
                    },
                  },
                },
              },
            })

          returnedCourse.course_tags = course_tags
        }

        return returnedCourse
      },
    })

    t.crud.courses({
      ordering: true,
    })

    t.list.nonNull.field("courses", {
      type: "Course",
      args: {
        orderBy: arg({ type: "CourseOrderByInput" }),
        language: stringArg(),
        search: nullable(stringArg()),
        hidden: nullable(booleanArg({ default: true })),
        handledBy: nullable(stringArg()),
        status: nullable(list(nonNull(arg({ type: "CourseStatus" })))),
        tags: nullable(list(nonNull(stringArg()))),
      },
      resolve: async (_, args, ctx) => {
        const { orderBy, language, search, hidden, handledBy, status, tags } =
          args

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
              {
                course_aliases: {
                  some: {
                    course_code: {
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
          // somehow NOT: { hidden: true } doesn't work
          // neither does { hidden: { not: true }}
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
        // TODO: if we want a filter that is strict (i.e. all tags must be present)
        // then we may need a raw query or just do that filtering in the frontend
        if (tags) {
          searchQuery.push({
            course_tags: {
              some: {
                tag: {
                  is: {
                    tag_translations: {
                      some: {
                        language: language ?? undefined,
                        name: { in: tags },
                      },
                    },
                  },
                },
              },
            },
          })
        }
        console.log(JSON.stringify(searchQuery, null, 2))
        const courses: (Course & {
          course_translations?: CourseTranslation[]
          course_tags?: (CourseTag & { language?: string })[]
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
                  course_tags: {
                    where: {
                      tag: {
                        tag_translations: {
                          some: {
                            language,
                          },
                        },
                      },
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
              course_tags: course.course_tags?.map((course_tag) => ({
                ...course_tag,
                language,
              })),
            }
          })
          .filter(notEmpty)

        console.log(JSON.stringify(filtered, null, 2))
        // TODO: (?) provide proper typing
        return filtered as (Course & { description: string; link: string })[]
      },
    })

    t.list.nonNull.field("handlerCourses", {
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

    t.nonNull.field("course_exists", {
      type: "Boolean",
      args: {
        slug: nonNull(stringArg()),
      },
      authorize: or(isAdmin, isUser),
      resolve: async (_, args, ctx) => {
        const { slug } = args

        return Boolean(
          await getCourseOrAlias(ctx)({
            where: {
              slug,
            },
            select: { id: true },
          }),
        )
      },
    })
  },
})
