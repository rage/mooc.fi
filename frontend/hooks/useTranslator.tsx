import { useCallback } from "react"

import { useRouter } from "next/router"

import getTranslator, {
  combineDictionaries,
  TranslationDictionary,
  TranslationObjectEntry,
  Translator,
} from "/translations"

export function useTranslator<T extends TranslationObjectEntry>(
  ...dicts: [TranslationDictionary<T>]
): Translator<T>
export function useTranslator<
  T extends TranslationObjectEntry,
  U extends TranslationObjectEntry,
>(
  ...dicts: [TranslationDictionary<T>, TranslationDictionary<U>]
): Translator<T & U>
export function useTranslator<
  T extends TranslationObjectEntry,
  U extends TranslationObjectEntry,
  V extends TranslationObjectEntry,
>(
  ...dicts: [
    TranslationDictionary<T>,
    TranslationDictionary<U>,
    TranslationDictionary<V>,
  ]
): Translator<T & U & V>
export function useTranslator<
  T extends TranslationObjectEntry,
  U extends TranslationObjectEntry = never,
  V extends TranslationObjectEntry = never,
>(
  ...dicts:
    | [TranslationDictionary<T>]
    | [TranslationDictionary<T>, TranslationDictionary<U>]
    | [
        TranslationDictionary<T>,
        TranslationDictionary<U>,
        TranslationDictionary<V>,
      ]
): Translator<T> | Translator<T & U> | Translator<T & U & V> {
  const router = useRouter()
  const { locale } = router ?? {}

  const combinedDict = combineDictionaries(dicts)
  /*[
    dicts[0],
    dicts[1] ?? {},
    dicts[2] ?? {},
  ])*/
  const translator = useCallback(
    getTranslator(combinedDict)(locale ?? "fi", router),
    [combinedDict, locale],
  )

  return translator
}
