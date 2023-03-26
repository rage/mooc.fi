import { useCallback } from "react"

import { useRouter } from "next/router"

import getTranslator, {
  combineDictionaries,
  LanguageKey,
  Translation,
  TranslationDictionary,
  Translator,
} from "/translations"

export function useTranslator<T extends Translation>(
  ...dicts: [TranslationDictionary<T>]
): Translator<T>
export function useTranslator<T extends Translation, U extends Translation>(
  ...dicts: [TranslationDictionary<T>, TranslationDictionary<U>]
): Translator<T & U>
export function useTranslator<
  T extends Translation,
  U extends Translation,
  V extends Translation,
>(
  ...dicts: [
    TranslationDictionary<T>,
    TranslationDictionary<U>,
    TranslationDictionary<V>,
  ]
): Translator<T & U & V>
export function useTranslator<
  T extends Translation,
  U extends Translation = any,
  V extends Translation = any,
>(
  ...dicts:
    | [TranslationDictionary<T>]
    | [TranslationDictionary<T>, TranslationDictionary<U>]
    | [
        TranslationDictionary<T>,
        TranslationDictionary<U>,
        TranslationDictionary<V>,
      ]
) {
  const router = useRouter()

  const combinedDict = combineDictionaries(dicts)
  /*[
    dicts[0],
    dicts[1] ?? {},
    dicts[2] ?? {},
  ])*/
  const translator = useCallback(
    getTranslator(combinedDict)(
      (router?.locale ?? "fi") as LanguageKey,
      router,
    ),
    [combinedDict, router?.locale],
  )

  return translator
}
