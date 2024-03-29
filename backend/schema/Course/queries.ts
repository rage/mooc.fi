import { omit } from "lodash"
import {
  arg,
  booleanArg,
  extendType,
  idArg,
  list,
  nonNull,
  stringArg,
} from "nexus"

import { Course, CourseTranslation, Prisma } from "@prisma/client"

import { isAdmin, isUser, or } from "../../accessControl"
import { GraphQLUserInputError } from "../../lib/errors"
import { filterNullRecursive, isDefined } from "../../util"

export const CourseQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("course", {
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
          throw new GraphQLUserInputError("must provide id or slug", [
            "id",
            "slug",
          ])
        }

        const query = {
          where: {
            id: id ?? undefined,
            slug: slug ?? undefined,
          },
          include: {
            tags: true,
            ...(language && {
              course_translations: {
                where: {
                  language,
                },
              },
            }),
          },
        }

        // TODO: limit these in the model
        /*...(ctx.role !== Role.ADMIN && {
            select: {
              id: true,
              slug: true,
              name: true,
            },
          }),*/
        const course = await ctx.prisma.course.findUniqueOrAlias(query)

        if (!course) {
          return null
        }

        const returnedCourse = {
          ...course,
          description: "",
          link: "",
        }

        if (language) {
          const { course_translations } = course as typeof course & {
            course_translations?: Array<CourseTranslation>
          }
          const course_translation = course_translations?.[0]

          if (!course_translation) {
            if (!translationFallback) {
              return Promise.resolve(null)
            }
          } else {
            returnedCourse.description = course_translation.description ?? ""
            returnedCourse.link = course_translation.link ?? ""
            returnedCourse.name = course_translation.name
          }
        }

        return returnedCourse
      },
    })

    t.list.nonNull.field("courses", {
      type: "Course",
      args: {
        orderBy: list(
          nonNull(
            arg({
              type: "CourseOrderByWithRelationAndSearchRelevanceInput",
            }),
          ),
        ),
        language: stringArg(),
        search: stringArg(),
        hidden: booleanArg({ default: true }),
        handledBy: stringArg(),
        status: list(nonNull(arg({ type: "CourseStatus" }))),
        tags: list(nonNull(stringArg())),
        tag_types: list(nonNull(stringArg())),
      },
      resolve: async (_, args, ctx) => {
        const {
          orderBy,
          language,
          search,
          hidden,
          handledBy,
          status,
          tags,
          tag_types,
        } = args

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
            OR: [
              {
                tags: {
                  some: {
                    tag_translations: {
                      some: {
                        language: language ?? undefined,
                        name: { in: tags },
                      },
                    },
                  },
                },
              },
              {
                handles_completions_for: {
                  some: {
                    tags: {
                      some: {
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
              },
            ],
          })
        }

        if (tag_types) {
          searchQuery.push({
            OR: [
              {
                tags: {
                  some: {
                    tag_types: {
                      some: {
                        name: { in: tag_types },
                      },
                    },
                  },
                },
              },
              {
                handles_completions_for: {
                  some: {
                    tags: {
                      some: {
                        tag_types: {
                          some: {
                            name: { in: tag_types },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          })
        }

        const courses: Array<
          Course & {
            course_translations?: Array<CourseTranslation>
          }
        > = await ctx.prisma.course.findMany({
          orderBy: filterNullRecursive(orderBy) ?? undefined,
          ...(searchQuery.length > 0
            ? {
                where: {
                  AND: searchQuery,
                },
              }
            : {}),
          ...(language
            ? {
                include: {
                  course_translations: {
                    where: {
                      language,
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
              ...omit(course, [
                "course_translations",
                "tags",
                "handles_completions_for",
              ]),
              description: course?.course_translations?.[0]?.description ?? "",
              link: course?.course_translations?.[0]?.link ?? "",
              name:
                (language
                  ? course?.course_translations?.[0]?.name ?? course?.name
                  : course?.name) ?? "",
            }
          })
          .filter(isDefined)

        // TODO: (?) provide proper typing
        return filtered as Array<
          Course & {
            description: string
            link: string
          }
        >
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
          await ctx.prisma.course.findUniqueOrAlias({
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
