import { Prisma } from "@prisma/client"

import { isDefined, isNullish } from "../../util"

const getNameCombinations = (search: string) => {
  const parts = search.match(/[^\s\n]+/g) ?? []
  const combinations = []
  for (let i = 1; i < parts.length; i++) {
    combinations.push({
      first_name: parts.slice(0, i).join(" "),
      last_name: parts.slice(i).join(" "),
    })
  }
  return combinations
}

export const buildUserSearch = (
  search?: string | null,
): Prisma.UserWhereInput => {
  if (isNullish(search)) {
    return {}
  }

  const possibleNameCombinations = getNameCombinations(search)

  const userSearchQuery: Prisma.UserWhereInput[] = [
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
    {
      user_organizations: {
        some: {
          organizational_email: { contains: search, mode: "insensitive" },
        },
      },
    },
  ]

  const searchAsNumber = parseInt(search)

  if (!isNaN(searchAsNumber)) {
    userSearchQuery.push({
      upstream_id: searchAsNumber,
    })
  }

  if (possibleNameCombinations.length) {
    possibleNameCombinations.forEach(({ first_name, last_name }) => {
      userSearchQuery.push({
        first_name: { contains: first_name, mode: "insensitive" },
        last_name: { contains: last_name, mode: "insensitive" },
      })
    })
  }

  return {
    OR: userSearchQuery,
  }
}

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
    skip: isDefined(before) ? skipValue + 1 : skipValue,
    take: isDefined(last) ? -(last ?? 0) : isDefined(first) ? first : 0,
    cursor: isDefined(before)
      ? { [field]: before }
      : isDefined(after)
      ? { [field]: after }
      : undefined,
  }
}
