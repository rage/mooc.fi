import newTheme from "/src/newTheme"

import { TagCoreFieldsFragment } from "/graphql/generated"

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

export const colorSchemes: Record<string, string> = {
  "Cyber Security Base": newTheme.palette.blue.dark2!,
  Ohjelmointi: newTheme.palette.green.dark2!,
  "Pilvipohjaiset websovellukset": newTheme.palette.crimson.dark2!,
  "Tekoäly ja data": newTheme.palette.purple.dark2!,
  other: newTheme.palette.gray.dark1!,
  difficulty: newTheme.palette.blue.dark1!,
  module: newTheme.palette.purple.dark1!,
  language: newTheme.palette.green.dark1!,
}
