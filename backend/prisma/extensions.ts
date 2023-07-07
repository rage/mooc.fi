import { omit } from "lodash"

import { Prisma, PrismaClient } from "@prisma/client"
import type { Types } from "@prisma/client/runtime"

import TMCClient from "../services/tmc"
import { isDefinedAndNotEmpty } from "../util"

interface PaginationArgs<T> {
  first?: number | null
  last?: number | null
  before?: Prisma.Args<T, "findUnique">["where"] | null
  after?: Prisma.Args<T, "findUnique">["where"] | null
  skip?: number | null
}

function baseFindManyWithPagination<T, A extends Types.Extensions.Args>(
  this: T,
  args: Prisma.Exact<A, Prisma.Args<T, "findMany">> & PaginationArgs<T>,
): Prisma.Result<T, A, "findMany"> {
  const {
    first,
    last,
    before,
    after,
    skip: skipValue,
    ...rest
  } = args as PaginationArgs<T> & object
  let skip = skipValue ?? 0
  let take = 0
  let cursor = undefined

  if (isDefinedAndNotEmpty(before)) {
    skip += 1
    cursor = before
  } else if (isDefinedAndNotEmpty(after)) {
    cursor = after
  }
  if (isDefinedAndNotEmpty(last)) {
    take = -(last ?? 0)
  } else if (isDefinedAndNotEmpty(first)) {
    take = first
  }

  return (this as any).findMany({
    ...rest,
    skip,
    take,
    cursor,
  })
}

export const findManyPagination = Prisma.defineExtension((client) =>
  client.$extends({
    name: "findManyWithPagination",
    model: {
      $allModels: {
        async findManyWithPagination<T, A extends Types.Extensions.Args>(
          this: T,
          args: Prisma.Exact<A, Prisma.Args<T, "findMany">> & PaginationArgs<T>,
        ): Promise<Prisma.Result<T, A, "findMany">> {
          // needs brackets after generics
          /* prettier-ignore */ return (baseFindManyWithPagination<T, A>).call(this, args)
        },
      },
      // FIXME: when $allModels not showing on specific model is fixed, remove
      user: {
        async findManyWithPagination<T, A extends Types.Extensions.Args>(
          this: T,
          args: Prisma.Exact<A, Prisma.Args<T, "findMany">> & PaginationArgs<T>,
        ): Promise<Prisma.Result<T, A, "findMany">> {
          // needs brackets after generics
          /* prettier-ignore */ return (baseFindManyWithPagination<T, A>).call(this, args)
        },
      },
    },
  }),
)

export const courseFindUniqueFns = Prisma.defineExtension((client) =>
  client.$extends({
    name: "courseFindUniqueFns",
    model: {
      course: {
        /**
         * Find course or if not found by slug, course through course alias.
         * Otherwise functions just like findUnique.
         * @param args {Prisma.CourseFindUniqueArgs} course findUnique args
         * @returns {Prisma.Prisma__CourseClient<Prisma.CourseGetPayload<T> | null, null>} course or course delegate
         */
        findUniqueOrAlias<
          A extends Types.Extensions.Args = Types.Extensions.DefaultArgs,
          Args extends Prisma.CourseFindUniqueOrThrowArgs<A> = Prisma.CourseFindUniqueOrThrowArgs<A>,
        >(
          args: Args,
        ): Prisma.Prisma__CourseClient<
          Prisma.CourseGetPayload<Args> | null, //Types.GetFindResult<CoursePayload<A>, Args>,
          null,
          A
        > {
          const { where, ...rest } = args
          const { slug } = where ?? {}

          const res = client.course
            .findUniqueOrThrow({ where, select: { id: true } })
            .then(() =>
              client.course.findUnique(
                // FIXME: temporary until Prisma extension typing fixed
                args as Types.Utils.Exact<Args, Prisma.CourseFindUniqueArgs<A>>,
              ),
            )
            .catch(() => {
              if (!slug) {
                return null
              }

              return client.courseAlias
                .findUnique({
                  where: {
                    course_code: slug,
                  },
                })
                .course({
                  where: omit(where, ["id", "slug"]),
                  ...rest,
                  // FIXME: temporary until Prisma extension typing fixed
                } as Types.Utils.Exact<Args, Prisma.CourseFindUniqueArgs<A>>)
            })

          return res as Prisma.Prisma__CourseClient<
            Prisma.CourseGetPayload<Args> | null,
            null,
            A
          >
        },
        /**
         * Find completion handler course. This can be the course itself, if no handler is set.
         * Also searches through course aliases. Otherwise functions just like findUnique.
         * @param args {Prisma.CourseFindUniqueArgs} course findUnique args
         * @returns {Prisma.Prisma__CourseClient<Prisma.CourseGetPayload<T> | null, null>} course or course delegate
         */
        findUniqueCompletionHandler<
          A extends Types.Extensions.Args = Types.Extensions.DefaultArgs,
          Args extends Prisma.CourseFindUniqueArgs<A> = Prisma.CourseFindUniqueArgs<A>,
        >(
          args: Args,
        ): Prisma.Prisma__CourseClient<
          Prisma.CourseGetPayload<Args> | null,
          null,
          A
        > {
          const { where, ...rest } = args

          const res = Prisma.getExtensionContext(this)
            .findUniqueOrAlias({
              where,
            })
            .then((course) => {
              if (!course) {
                return null
              }
              return client.course.findUnique({
                where: {
                  id: course.completions_handled_by_id ?? course.id,
                },
                ...rest,
                // FIXME: temporary until Prisma extension typing fixed
              } as Types.Utils.Exact<Args, Prisma.CourseFindUniqueArgs<A>>)
            })

          return res as Prisma.Prisma__CourseClient<
            Prisma.CourseGetPayload<Args> | null,
            null,
            A
          >
        },
      },
    },
  }),
)

export const createFromTMC = Prisma.defineExtension((client) =>
  client.$extends({
    name: "createFromTMC",
    model: {
      user: {
        async createFromTMC(user_id: number) {
          const tmc = new TMCClient()
          const userDetails = await tmc.getUserDetailsById(user_id)

          return client.user.create({
            data: {
              upstream_id: userDetails.id,
              first_name: userDetails.user_field.first_name,
              last_name: userDetails.user_field.last_name,
              email: userDetails.email,
              username: userDetails.username,
              administrator: userDetails.administrator,
            },
          })
        },
      },
    },
  }),
)

type UserFindUserCourseSettingsArgs = {
  where: {
    user_id: string
    course_id?: string
    course_slug?: string
  }
}

export const findUsercourseSettings = Prisma.defineExtension((client) =>
  client.$extends({
    name: "findUsercourseSettings",
    model: {
      user: {
        /**
         * Get user course settings for a given user and a given course.
         * If the course inherits user course settings from other course, get settings from that one.
         * @param args {UserFindUserCourseSettingsArgs}
         * @returns {import("@prisma/client").UserCourseSetting | null}
         */
        async findUserCourseSettings(
          args: UserFindUserCourseSettingsArgs,
        ): Promise<Prisma.Result<
          Prisma.UserCourseSettingDelegate<false>,
          Types.Extensions.DefaultArgs,
          "findFirst"
        > | null> {
          const { where } = args
          const { user_id, course_id, course_slug } = where
          if (!course_slug && !course_id) {
            return null
          }

          const include = {
            user_course_settings: {
              where: {
                user_id,
              },
              orderBy: {
                created_at: "asc",
              },
            },
            inherit_settings_from: {
              include: {
                user_course_settings: {
                  where: {
                    user_id,
                  },
                  orderBy: {
                    created_at: "asc",
                  },
                },
              },
            },
          } as const

          let res

          if (course_slug) {
            res = await (
              client.$extends({}) as ExtendedPrismaClient<PrismaClient>
            ).course.findUniqueOrAlias({
              where: {
                slug: course_slug,
              },
              include,
            })
          } else {
            res = await client.course.findUnique({
              where: {
                id: course_id,
              },
              include,
            })
          }

          return (
            res?.inherit_settings_from?.user_course_settings?.[0] ??
            res?.user_course_settings?.[0] ??
            null
          )
        },
      },
    },
  }),
)

export const applyExtensions = <P extends PrismaClient>(prisma: P) =>
  prisma
    .$extends(findManyPagination)
    .$extends(courseFindUniqueFns)
    .$extends(createFromTMC)
    .$extends(findUsercourseSettings)

export type ExtendedPrismaClient<P extends PrismaClient> = ReturnType<
  typeof applyExtensions<P>
>
