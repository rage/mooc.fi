import memoize from "lodash/memoize"
import { NextRouter } from "next/router"

import notEmpty from "/util/notEmpty"

export type TranslationKey = string
export type LanguageKey = string
export type TranslationString = string

const defaultLanguage = "en"

type ArrayTranslation = Array<TranslationEntry>
type ObjectTranslation = { [Key in TranslationKey]: TranslationEntry }
type TranslationEntry = TranslationString | ArrayTranslation | ObjectTranslation

export type Translation<EntryType extends TranslationEntry = TranslationEntry> =
  Record<TranslationKey, EntryType>

export type TranslationDictionary<T extends Translation> = Record<
  LanguageKey,
  T
>

export type TranslationVariables = Record<string, any>
export type Translator<T extends Translation> = (
  key: keyof T,
  variables?: TranslationVariables,
) => any

const isArrayTranslation = (
  translation: TranslationEntry,
): translation is ArrayTranslation => Array.isArray(translation)
const isObjectTranslation = (
  translation: TranslationEntry,
): translation is ObjectTranslation =>
  !isArrayTranslation(translation) &&
  typeof translation === "object" &&
  translation !== null
const isStringTranslation = (
  translation: TranslationEntry,
): translation is TranslationString => typeof translation === "string"

const getTranslator =
  <T extends Translation>(dicts: TranslationDictionary<T>) =>
  (lng: LanguageKey, router?: NextRouter): Translator<T> =>
    memoize(
      (key: keyof T, variables?: TranslationVariables) => {
        const translation = dicts[lng]?.[key] || dicts[defaultLanguage]?.[key]

        if (!translation) {
          console.warn(`WARNING: no translation for ${lng}:${String(key)}`)
          return key
        }

        return isArrayTranslation(translation)
          ? translation.map((t) =>
              substitute({ translation: t, variables, router }),
            )
          : substitute({ translation, variables, router })
      },
      (...args) =>
        // cached value is supposed to depend on possible given variables
        args.reduce((acc, curr) => {
          if (typeof curr === "function") {
            return `${String(acc)}_${curr.name}`
          }
          if (typeof curr === "object") {
            return `${String(acc)}_${JSON.stringify(curr)}`
          }
          return `${String(acc)}_${String(curr)}`
        }, ""),
    )

interface Substitute<TE extends TranslationEntry> {
  translation: TE // T[Key]
  variables?: TranslationVariables
  router?: NextRouter
}

const substitute = <TE extends TranslationEntry = TranslationEntry>({
  translation,
  variables,
  router,
}: Substitute<TE>): TranslationEntry => {
  if (isArrayTranslation(translation)) {
    return translation.map((t) =>
      substitute({ translation: t, variables, router }),
    )
  }
  if (isObjectTranslation(translation)) {
    const substituteObject: ObjectTranslation = {}

    for (const key of Object.keys(translation)) {
      substituteObject[key] = substitute({
        translation: translation[key],
        variables,
        router,
      })
    }
    return substituteObject
  }

  if (!isStringTranslation(translation)) {
    console.warn(
      `WARNING: translation only supports strings, arrays or objects - got ${JSON.stringify(
        translation,
      )} of type ${typeof translation}`,
    )

    return translation
  }

  // {{key}} is replaced by variable key given as parameter
  // [[key]] is replaced by query parameter named "key"

  const replaceGroups = translation.match(/{{(.*?)}}/gm)
  const keyGroups = translation.match(/\[\[(.*?)\]\]/gm)

  let ret: TranslationString = translation

  if (!replaceGroups && !keyGroups) {
    return ret
  }

  if (keyGroups) {
    if (!router && process.browser) {
      console.warn(
        `WARNING: no router given to translator - needed to access query parameters in ${translation}`,
      )
    }
    keyGroups?.forEach((g: string) => {
      const key = g.slice(2, g.length - 2)
      const replaceRegExp = new RegExp(`\\[\\[${key}\\]\\]`, "g")
      const queryParam = router?.query?.[key] ?? "..."

      if (!queryParam) {
        console.warn(
          `WARNING: no query param ${key} found for translation ${translation}`,
        )
      }

      ret = ret.replace(
        replaceRegExp,
        Array.isArray(queryParam) ? queryParam[0] : queryParam,
      )
    })
  }

  if (!variables && replaceGroups) {
    console.warn(
      `WARNING: no variables present for translation string "${translation}"`,
    )
    return ret
  }

  ;(replaceGroups ?? []).forEach((g: string) => {
    const key = g.slice(2, g.length - 2)
    const variable = variables?.[key]

    if (variable === null || typeof variable === "undefined") {
      console.warn(
        `WARNING: no variable present for translation string "${translation}" and key "${key}"`,
      )
    } else {
      const replaceRegExp = new RegExp(`{{${key}}}`, "g")
      ret = ret.replace(replaceRegExp, `${variable}`)
    }
  })

  return ret
}

const _combineDictionaries = <
  T extends Translation,
  U extends Translation = any,
  V extends Translation = any,
>(
  dicts: [
    TranslationDictionary<T>,
    TranslationDictionary<U>?,
    TranslationDictionary<V>?,
  ],
): TranslationDictionary<T & U & V> => {
  const combined: TranslationDictionary<T & U & V> = {}

  // TODO: not very good now
  /*
    const languages = Array.from(new Set(...dicts.map(dict => Object.keys(dict))))
    const common = intersection(
    dicts.map((dict) => Object.keys(dict[languages[0]] ?? [])),
  )

  if (common.length) {
    console.warn(
      `WARNING: translation dictionary key clash - following key(s) have duplicates: ${common.join(
        ", ",
      )}`,
    )
  }*/

  for (const dict of dicts.filter(notEmpty)) {
    for (const lang of Object.keys(dict)) {
      combined[lang] = Object.assign(combined[lang] ?? {}, dict[lang] ?? {})
    }
  }

  return combined
}

const keyResolver = (...args: any[]) => JSON.stringify(args)
export const combineDictionaries = memoize(_combineDictionaries, keyResolver)

export const isTranslationKey = <T extends Translation>(
  key?: keyof T,
): key is keyof T => key !== null && key !== undefined

export default getTranslator
