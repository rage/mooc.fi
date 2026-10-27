export interface FilterableTag {
  id: string
  types?: Array<string>
}

export interface FilterableCourse {
  name: string
  description?: string | null
  hidden?: boolean | null
  status?: string | null
  tags: Array<{ id: string }>
  study_modules: Array<unknown>
  course_translations?: Array<{
    name: string
    description?: string | null
  }>
}

export type TagsByCategory = Record<string, Array<FilterableTag>>

export interface CourseFilters {
  search: string
  activeTagIds: Array<string>
  tagsByCategory: TagsByCategory
  statuses: Array<string>
  moduleless?: boolean
}

export const DEFAULT_STATUSES = ["Active", "Upcoming"]

/** Lowercases and strips diacritics so "Äidinkieli" matches "aidinkieli". */
export const normalizeSearchText = (text: string) =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

/**
 * True when every whitespace-separated word of `search` occurs in the name or
 * description of the course in any of its translations.
 */
export const courseMatchesSearch = (
  course: FilterableCourse,
  search: string,
) => {
  const words = normalizeSearchText(search).split(/\s+/).filter(Boolean)
  if (words.length === 0) {
    return true
  }
  const haystack = normalizeSearchText(
    [
      course.name,
      course.description,
      ...(course.course_translations ?? []).flatMap((translation) => [
        translation.name,
        translation.description,
      ]),
    ]
      .filter(Boolean)
      .join("\n"),
  )
  return words.every((word) => haystack.includes(word))
}

/**
 * Tags are OR-ed within a category and AND-ed across categories. A category
 * whose tags are all selected restricts nothing, so "select all" never hides
 * courses that lack a tag of that category.
 */
export const courseMatchesTags = (
  course: FilterableCourse,
  activeTagIds: Array<string>,
  tagsByCategory: TagsByCategory,
) => {
  const activeIdsByCategory = new Map<string, Set<string>>()
  for (const [category, tags] of Object.entries(tagsByCategory)) {
    const ids = tags.filter((tag) => activeTagIds.includes(tag.id))
    if (ids.length > 0 && ids.length < tags.length) {
      activeIdsByCategory.set(category, new Set(ids.map((tag) => tag.id)))
    }
  }
  const courseTagIds = new Set(course.tags.map((tag) => tag.id))
  return [...activeIdsByCategory.values()].every((ids) =>
    [...ids].some((id) => courseTagIds.has(id)),
  )
}

export const filterCourses = <T extends FilterableCourse>(
  courses: Array<T>,
  { search, activeTagIds, tagsByCategory, statuses, moduleless }: CourseFilters,
): Array<T> =>
  courses.filter((course) => {
    if (course.hidden) {
      return false
    }
    if (moduleless && course.study_modules.length > 0) {
      return false
    }
    if (!courseMatchesSearch(course, search)) {
      return false
    }
    if (!courseMatchesTags(course, activeTagIds, tagsByCategory)) {
      return false
    }
    return (
      statuses.length === 0 ||
      !course.status ||
      statuses.includes(course.status)
    )
  })

/**
 * Tag ids the filter applies. An untouched selection (`null`) falls back to the
 * UI-language tag, except while searching: a name search must not be hidden by
 * a language the user never chose.
 */
export const resolveActiveTagIds = ({
  explicitTagIds,
  defaultLanguageTagId,
  search,
}: {
  explicitTagIds: Array<string> | null
  defaultLanguageTagId?: string
  search: string
}): Array<string> => {
  if (explicitTagIds) {
    return explicitTagIds
  }
  if (!defaultLanguageTagId || search.trim()) {
    return []
  }
  return [defaultLanguageTagId]
}

type QueryValue = string | Array<string> | undefined
export type FilterQuery = Record<string, QueryValue>

export interface FilterUrlState {
  search: string
  /** `null` when the URL carries no `tag` param, i.e. the selection is untouched. */
  tagIds: Array<string> | null
  statuses: Array<string>
}

const toArray = (value: QueryValue) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

const lastOf = (value: QueryValue) => {
  const values = toArray(value)
  return values[values.length - 1] ?? ""
}

export const parseFilterQuery = (
  query: FilterQuery,
  validStatuses: ReadonlyArray<string>,
): FilterUrlState => ({
  search: lastOf(query.search),
  tagIds: query.tag === undefined ? null : toArray(query.tag).filter(Boolean),
  statuses:
    query.status === undefined
      ? DEFAULT_STATUSES
      : toArray(query.status).filter((status) =>
          validStatuses.includes(status),
        ),
})

const isDefaultStatuses = (statuses: Array<string>) =>
  statuses.length === DEFAULT_STATUSES.length &&
  DEFAULT_STATUSES.every((status) => statuses.includes(status))

/**
 * Returns `query` with the given filter params replaced; other params are kept.
 * Defaults are omitted from the URL; an explicitly empty tag or status
 * selection is written as an empty value so it survives a reload.
 */
export const applyFilterState = (
  query: FilterQuery,
  patch: Partial<FilterUrlState>,
): FilterQuery => {
  const next = { ...query }
  if (patch.search !== undefined) {
    if (patch.search) {
      next.search = patch.search
    } else {
      delete next.search
    }
  }
  if ("tagIds" in patch) {
    if (patch.tagIds === null || patch.tagIds === undefined) {
      delete next.tag
    } else {
      next.tag = patch.tagIds.length > 0 ? patch.tagIds : ""
    }
  }
  if (patch.statuses !== undefined) {
    if (isDefaultStatuses(patch.statuses)) {
      delete next.status
    } else {
      next.status = patch.statuses.length > 0 ? patch.statuses : ""
    }
  }
  return next
}
