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

interface ConvertPaginationOptions {
  field?: string
}

interface ConvertPaginationOutput {
  skip?: number
  cursor?: { [key: string]: string }
  take?: number
}

const isDefined = <T>(value: T | undefined | null): value is T =>
  typeof (<T>value) !== "undefined" && <T>value !== null

export const convertPagination = (
  { first, last, before, after, skip }: ConvertPaginationInput,
  options?: ConvertPaginationOptions,
): ConvertPaginationOutput => {
  const skipValue = skip || 0
  const { field = "id" } = options || {}

  if (!first && !last) {
    throw new Error("first or last must be defined")
  }

  // TODO/FIXME: shouldn't skip be +1 when after is defined?
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
