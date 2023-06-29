import memoize from "just-memoize"
import { NextRouter } from "next/router"

import { isDefinedAndNotEmpty } from "/util/guards"

export type LanguageKey = string
const defaultLanguage = "en" as const

export type TranslationObjectEntry = {
  [Key: string]:
    | string
    | TranslationEntry
    | Array<TranslationEntry>
    | Readonly<string>
    | Readonly<TranslationEntry>
    | Readonly<Array<TranslationEntry>>
}

export type TranslationEntry =
  | {
      [Key: number]:
        | string
        | TranslationEntry
        | Array<TranslationEntry>
        | Readonly<string>
        | Readonly<TranslationEntry>
        | Readonly<Array<TranslationEntry>>
    }
  | TranslationObjectEntry
  | string[]
  | Readonly<string[]>

export type TranslationKey<
  T extends TranslationEntry | Array<TranslationEntry> = TranslationEntry,
> = keyof T
export type TranslatedString = string

export type TranslationDictionary<
  T extends TranslationObjectEntry = TranslationObjectEntry,
  D extends { [Key: LanguageKey]: T } = {
    [Key: LanguageKey]: T
  },
> = {
  [Key in keyof D as LanguageKey]: D[Key]
}

export type KeyOfTranslation<T> = T extends TranslationObjectEntry
  ? keyof T
  : never
export type KeyOfTranslationDictionary<T> = T extends TranslationDictionary<
  infer T
>
  ? keyof T
  : never

type VarsHelper<
  T extends string,
  Acc = never,
> = T extends `${infer _Prefix}{{${infer Var}}}${infer Rest}`
  ? VarsHelper<Rest, Acc | Var>
  : Acc
type Vars<T extends string> = VarsHelper<T, never>

type VariablesOfEntry<EntryType, Acc = never> = EntryType extends string
  ? Acc | Vars<EntryType>
  : EntryType extends string[]
  ? Acc | Vars<EntryType[number]>
  : EntryType extends object
  ? EntryType extends (infer ET)[]
    ? VariablesOfEntry<ET, Acc>
    : VariablesOfEntry<EntryType[keyof EntryType], Acc>
  : Acc

type AllKeys<T> = T extends unknown ? keyof T : never

type AddMissingProps<T, K extends PropertyKey = AllKeys<T>> = T extends unknown
  ? T & Record<Exclude<K, keyof T>, never>
  : never

type MergeUnion<T> = { [K in keyof AddMissingProps<T>]: AddMissingProps<T>[K] }

export type TranslationVariables<
  T extends TranslationEntry,
  V = VariablesOfEntry<T>,
> = (V extends string ? { [K in V]?: any } : never) extends infer O
  ? [keyof MergeUnion<O>] extends [never]
    ? never
    : { [Key in keyof MergeUnion<O>]: MergeUnion<O>[Key] }
  : never

const isArrayTranslation = (
  translation: TranslationEntry,
): translation is Array<TranslationEntry> | Readonly<Array<TranslationEntry>> =>
  Array.isArray(translation)
const isObjectTranslation = (
  translation: TranslationEntry,
): translation is { [Key: string]: TranslationEntry } =>
  !isArrayTranslation(translation) &&
  typeof translation === "object" &&
  translation !== null
const isStringTranslation = (
  translation: TranslationEntry,
): translation is string => typeof translation === "string"

type TranslationReturn<T, K> = K extends keyof T ? T[K] : K

export type Translator<T extends TranslationObjectEntry> = <
  K extends Extract<keyof T, string>,
>(
  key: K,
  variables?: TranslationVariables<T>,
) => K extends keyof T ? T[K] : K

const getTranslator =
  <D extends TranslationDictionary = TranslationDictionary>(dicts: D) =>
  <Language extends Extract<keyof D, string>>(
    lng: Language,
    router?: NextRouter,
  ) =>
    memoize(
      <Key extends Extract<keyof D[Language], string>>(
        key: Key,
        variables?: TranslationVariables<D[Language]>,
      ): TranslationReturn<D[Language], Key> => {
        const translation =
          dicts[lng]?.[key] || dicts[defaultLanguage]?.[key as any]

        if (!translation) {
          console.warn(`WARNING: no translation for ${lng}:${String(key)}`)
          return key as TranslationReturn<D[Language], Key>
        }
        if (isArrayTranslation(translation)) {
          return translation.map((t) =>
            // @ts-ignore: TODO: fix infinite recursion
            substitute(t, variables, router),
          ) as TranslationReturn<D[Language], Key>
        }
        return substitute(translation, variables, router) as TranslationReturn<
          D[Language],
          Key
        >
      },
      (key, variables) =>
        // cached value is supposed to depend on possible given variables
        [key, variables].reduce<string>((acc, curr) => {
          if (typeof curr === "object") {
            return `${String(acc)}_${JSON.stringify(curr)}`
          }
          return `${String(acc)}_${String(curr)}`
        }, ""),
    )

const substitute = <TE extends TranslationEntry>(
  translation: TE,
  variables?: TranslationVariables<TE>,
  router?: NextRouter,
): TE => {
  if (isArrayTranslation(translation)) {
    return translation.map((t) =>
      // @ts-ignore: TODO: fix infinite recursion
      substitute(t, variables, router),
    ) as TE
  }
  if (isObjectTranslation(translation)) {
    const substituteObject = {} as typeof translation

    for (const key of Object.keys(translation)) {
      substituteObject[key] = substitute(
        translation[key],
        variables,
        router,
      ) as TE
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

  let ret = translation

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
      ) as typeof translation
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
      ret = ret.replace(replaceRegExp, `${variable}`) as typeof translation
    }
  })

  return ret
}

const _combineDictionaries = <
  T extends TranslationObjectEntry,
  U extends TranslationObjectEntry = never,
  V extends TranslationObjectEntry = never,
>(
  dicts: [
    TranslationDictionary<T>,
    TranslationDictionary<U>?,
    TranslationDictionary<V>?,
  ],
): TranslationDictionary<T & U & V> => {
  const combined: TranslationDictionary<T & U & V> = {}

  for (const dict of dicts.filter(isDefinedAndNotEmpty)) {
    for (const lang of Object.keys(dict)) {
      combined[lang] = Object.assign(combined[lang] ?? {}, dict[lang] ?? {})
    }
  }

  return combined
}

const keyResolver = (...args: any[]) => JSON.stringify(args)
export const combineDictionaries = memoize(_combineDictionaries, keyResolver)
// export const combineDictionaries = _combineDictionaries

export const isTranslationKey = <T extends TranslationObjectEntry>(
  key?: keyof T,
): key is keyof T => key !== null && key !== undefined

export default getTranslator
