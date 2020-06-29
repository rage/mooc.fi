const flatten = (arr: any[]) => arr.reduce((acc, val) => acc.concat(val), [])
const titleCase = (s?: string) =>
  s && s.length > 0
    ? s.toLowerCase()[0].toUpperCase() + s.toLowerCase().slice(1)
    : undefined

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

interface ConvertPaginationOutput {
  skip?: number
  cursor?: { id: string }
  take?: number
}

const isDefined = <T>(value: T | undefined | null): value is T =>
  typeof (<T>value) !== "undefined" && <T>value !== null

export const convertPagination = ({
  first,
  last,
  before,
  after,
  skip,
}: ConvertPaginationInput): ConvertPaginationOutput => {
  const skipValue = skip || 0

  if (!first && !last) {
    throw new Error("first or last must be defined")
  }

  console.log(
    "first ",
    first,
    "last ",
    last,
    "before ",
    before,
    "after",
    after,
    "skip ",
    skip,
  )

  return {
    skip: isDefined(before) ? skipValue + 1 : skipValue,
    take: isDefined(last) ? -(last ?? 0) : isDefined(first) ? first : 0,
    cursor: isDefined(before)
      ? { id: before }
      : isDefined(after)
      ? { id: after }
      : undefined,
  }
}
