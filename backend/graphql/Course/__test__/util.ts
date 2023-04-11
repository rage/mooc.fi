import { get, orderBy } from "lodash"

export const courseInclude = {
  tags: {
    include: {
      tag_types: true,
      tag_translations: true,
    },
  },
  course_translations: true,
  course_aliases: true,
  course_variants: true,
  exercises: true,
  completions_handled_by: true,
  handles_completions_for: true,
  inherit_settings_from: true,
  photo: true,
  open_university_registration_links: true,
  completion_email: true,
  course_stats_email: true,
  study_modules: {
    include: {
      study_module_translations: true,
    },
  },
  services: true,
}

export const sortArrayField =
  (field: string, id: Array<string> = ["id"]) =>
  (object: any) => {
    if (!get(object, field)) {
      return object
    }

    return {
      ...object,
      [field]: orderBy(get(object, field), id, ["asc"]),
    }
  }

// study_modules may be returned in any order, let's just sort them so snapshots are equal

export const sortCourseTranslations = sortArrayField("course_translation", [
  "language",
])
export const sortStudyModules = sortArrayField("study_modules")
export const sortExercises = sortArrayField("exercises")
export const sortTags = (course: any) =>
  sortArrayField("tags")({
    ...course,
    tags: (course?.tags ?? []).map((tag: any) => ({
      ...tag,
      ...(tag.types && { types: orderBy(tag.types) }),
      ...(tag.tag_types && {
        tag_types: sortArrayField("tag_types", ["name"])(tag).tag_types,
      }),
      ...(tag.tag_translations && {
        tag_translations: sortArrayField("tag_translations", [
          "language",
          "name",
          "description",
        ])(tag).tag_translations,
      }),
    })),
  })

export const applySortFns =
  (sortFns: Array<<T>(course: T) => T>) => (course: any) => {
    return sortFns.reduce((course, fn) => fn(course), course)
  }
