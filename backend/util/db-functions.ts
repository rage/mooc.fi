import { notEmpty } from "./notEmpty"
import { isNullOrUndefined } from "./isNullOrUndefined"
import { Prisma } from "@prisma/client"

const flatten = (arr: any[]) => arr.reduce((acc, val) => acc.concat(val), [])
const titleCase = (s?: string) =>
  s && s.length > 0
    ? s.toLowerCase()[0].toUpperCase() + s.toLowerCase().slice(1)
    : undefined

export const buildUserSearch = (
  search?: string | null,
): Prisma.UserWhereInput => {
  if (isNullOrUndefined(search)) {
    return {}
  }
  return {
    OR: [
      {
        first_name: { contains: search, mode: "insensitive" },
      },
      {
        last_name: { contains: search, mode: "insensitive" },
      },
      {
        username: { contains: search, mode: "insensitive" },
      },
      {
        email: { contains: search, mode: "insensitive" },
      },
      {
        student_number: { contains: search },
      },
      {
        real_student_number: { contains: search },
      },
      !Number.isNaN(Number(search))
        ? {
            upstream_id: Number(search),
          }
        : undefined,
    ].filter(notEmpty) as Prisma.UserWhereInput, //.filter(notEmpty),
  }
}

export const buildSearch = (fields: string[], search?: string) =>
  search
    ? flatten(
        fields.map((f) => [
          { [f]: { contains: search } },
          { [f]: { contains: titleCase(search) } },
          { [f]: { contains: search.toLowerCase() } },
        ]),
      )
    : undefined

interface ConvertPaginationInput {
  first?: number | null
  last?: number | null
  before?: string | null
  after?: string | null
  skip?: number | null
}

interface ConvertPaginationOptions {
  field?: string
}

interface ConvertPaginationOutput {
  skip?: number
  cursor?: { [key: string]: string }
  take?: number
}

export const convertPagination = (
  { first, last, before, after, skip }: ConvertPaginationInput,
  options?: ConvertPaginationOptions,
): ConvertPaginationOutput => {
  const skipValue = skip || 0
  const { field = "id" } = options || {}

  if (!first && !last) {
    throw new Error("first or last must be defined")
  }

  return {
    skip: notEmpty(before) ? skipValue + 1 : skipValue,
    take: notEmpty(last) ? -(last ?? 0) : notEmpty(first) ? first : 0,
    cursor: notEmpty(before)
      ? { [field]: before }
      : notEmpty(after)
      ? { [field]: after }
      : undefined,
  }
}

export const filterNull = <T>(o: T): T | undefined =>
  o
    ? Object.entries(o).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: v == null ? undefined : v }),
        {} as T,
      )
    : undefined

// helper function to convert to atomicNumberOperations
// https://github.com/prisma/prisma/issues/3491#issuecomment-689542237
export const convertUpdate = <T extends object>(input: {
  [key: string]: any
}): T =>
  Object.entries(input).reduce(
    (acc: any, [key, value]: [string, any]) => ({
      ...acc,
      [key]: Array.isArray(value)
        ? value.map(convertUpdate)
        : typeof value === "object"
        ? convertUpdate(value)
        : ["number", "boolean"].includes(typeof value)
        ? { set: value }
        : value,
    }),
    {},
  )
