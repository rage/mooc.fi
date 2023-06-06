import { PaletteColor } from "@mui/material"

import newTheme from "/src/newTheme"

import { CourseStatus, TagCoreFieldsFragment } from "/graphql/generated"

export const allowedLanguages = ["fi", "en", "se", "other_language"]

export const sortByLanguage = (
  a: TagCoreFieldsFragment,
  b: TagCoreFieldsFragment,
) => {
  if (allowedLanguages.indexOf(a.id) === -1) {
    return 1
  }
  if (allowedLanguages.indexOf(b.id) === -1) {
    return -1
  }
  return allowedLanguages.indexOf(a.id) - allowedLanguages.indexOf(b.id)
}

const difficultyOrder = ["beginner", "intermediate", "advanced"]

export const sortByDifficulty = (
  a: TagCoreFieldsFragment,
  b: TagCoreFieldsFragment,
) => difficultyOrder.indexOf(a.id) - difficultyOrder.indexOf(b.id)

export const colorSchemes: Record<string, PaletteColor[keyof PaletteColor]> = {
  "cyber-security": newTheme.palette.blue.dark2,
  programming: newTheme.palette.green.dark2,
  "pilvipohjaiset-websovellukset": newTheme.palette.crimson.dark2,
  "tekoaly-ja-data": newTheme.palette.purple.dark2,
  other: newTheme.palette.gray.dark1,
  difficulty: newTheme.palette.blue.dark1,
  module: newTheme.palette.purple.dark1,
  language: newTheme.palette.green.dark1,
  program: newTheme.palette.green.dark2, // dev
  webdev: newTheme.palette.blue.dark2, // dev
}

export const courseStatuses: readonly CourseStatus[] = [
  CourseStatus.Active,
  CourseStatus.Upcoming,
  CourseStatus.Ended,
]
