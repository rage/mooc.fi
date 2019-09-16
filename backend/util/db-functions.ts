const flatten = (arr: any[]) => arr.reduce((acc, val) => acc.concat(val), [])
const titleCase = (s?: string) =>
  s && s.length > 0
    ? s.toLowerCase()[0].toUpperCase() + s.toLowerCase().slice(1)
    : undefined

export const buildSearch = (fields: string[], search?: string) =>
  search
    ? flatten(
        fields.map(f => [
          { [f]: search },
          { [f]: titleCase(search) },
          { [f]: search.toLowerCase() },
        ]),
      )
    : undefined
