import { NextRouter } from "next/router"
import { memoize } from "lodash"
import notEmpty from "/util/notEmpty"

const defaultLanguage = "en"

type ArrayTranslation = Array<Translation>
type ObjectTranslation = Record<string, string>
type BaseTranslation = string
type TranslationEntry = BaseTranslation | ArrayTranslation | ObjectTranslation

export type Translation = Record<string, TranslationEntry>

export type TranslationDictionary<T extends Translation> = Record<string, T>

export type Translator<T extends Translation> = (
  key: keyof T,
  variables?: Record<string, any>,
) => any

const isArrayTranslation = <T extends Translation>(
  translation: T[keyof T] | T[keyof T][],
): translation is T[keyof T][] => Array.isArray(translation)
const isObjectTranslation = (
  translation: TranslationEntry,
): translation is ObjectTranslation => typeof translation === "object"
const isStringTranslation = (
  translation: TranslationEntry,
): translation is BaseTranslation => typeof translation === "string"

const getTranslator =
  <T extends Translation>(dicts: Record<string, T>) =>
  (lng: string, router?: NextRouter): Translator<T> =>
    memoize(
      (key: keyof T, variables?: Record<string, any>) => {
        const translation = dicts[lng]?.[key] || dicts[defaultLanguage]?.[key]

        if (!translation) {
          console.warn(`WARNING: no translation for ${lng}:${key}`)
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
            return `${acc}_${curr.name}`
          }
          if (typeof curr === "object") {
            return `${acc}_${JSON.stringify(curr)}`
          }
          return `${acc}_${curr}`
        }, ""),
    )

interface Substitute<T> {
  translation: T[keyof T]
  variables?: Record<string, any>
  router?: NextRouter
}

const substitute = <T extends Translation>({
  translation,
  variables,
  router,
}: Substitute<T>): any => {
  if (isObjectTranslation(translation)) {
    return Object.keys(translation).reduce(
      (obj, key) => ({
        ...obj,
        [key]: substitute({
          translation: translation[key],
          variables,
          router,
        }),
      }),
      {} as T,
    )
  }

  if (!isStringTranslation(translation)) {
    console.warn(
      `WARNING: translation only supports strings or objects - got ${translation} of type ${typeof translation}`,
    )

    return translation
  }

  // {{key}} is replaced by variable key given as parameter
  // [[key]] is replaced by query parameter named "key"

  const replaceGroups = translation.match(/{{(.*?)}}/gm)
  const keyGroups = translation.match(/\[\[(.*?)\]\]/gm)

  let ret: string = translation

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

  ;(replaceGroups || []).forEach((g: string) => {
    const key = g.slice(2, g.length - 2)
    const variable = (variables || {})[key]

    if (variable === null || variable === undefined) {
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
  U extends Translation = {},
  V extends Translation = {},
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
