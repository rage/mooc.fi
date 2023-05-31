import { omit } from "lodash"

import { Prisma } from "@prisma/client"

import { notEmpty } from "../util/notEmpty"

interface PaginationArgs<T> {
  first?: number | null
  last?: number | null
  before?: Prisma.Args<T, "findUnique">["where"] | null
  after?: Prisma.Args<T, "findUnique">["where"] | null
  skip?: number | null
}

export const findManyPagination = Prisma.defineExtension({
  name: "findManyWithPagination",
  model: {
    $allModels: {
      async findManyWithPagination<T, A>(
        this: T,
        args: Prisma.Exact<A, Prisma.Args<T, "findMany"> & PaginationArgs<T>>,
      ): Promise<Prisma.Result<T, A, "findMany">> {
        const ctx = Prisma.getExtensionContext(this)
        const {
          first,
          last,
          before,
          after,
          skip: skipValue,
          ...rest
        } = args as any
        let skip = skipValue ?? 0
        let take = 0
        let cursor = undefined

        if (notEmpty(before)) {
          skip += 1
          cursor = before
        } else if (notEmpty(after)) {
          cursor = after
        }
        if (notEmpty(last)) {
          take = -(last ?? 0)
        } else if (notEmpty(first)) {
          take = first
        }

        return (ctx as any).findMany({
          ...rest,
          skip,
          take,
          cursor,
        })
      },
    },
  },
})

export const courseFindUniqueOrAlias = Prisma.defineExtension((client) =>
  client.$extends({
    name: "courseFindUniqueOrAlias",
    model: {
      course: {
        findUniqueOrAlias<T extends Prisma.CourseFindUniqueOrThrowArgs>(
          args: T,
        ): Prisma.Prisma__CourseClient<
          Prisma.CourseGetPayload<T> | null,
          null
        > {
          const { where, ...rest } = args
          const { slug } = where ?? {}

          const res = client.course
            .findUniqueOrThrow(args)
            .then(() => client.course.findUnique(args))
            .catch(() =>
              client.courseAlias
                .findUnique({
                  where: {
                    course_code: slug,
                  },
                })
                .course({
                  where: omit(where, ["id", "slug"]),
                  ...rest,
                }),
            )

          return res as Prisma.Prisma__CourseClient<Prisma.CourseGetPayload<T>>
        },
      },
    },
  }),
)
