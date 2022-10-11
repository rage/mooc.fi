import { useMemo } from "react"

import { useRouter } from "next/router"

import getTranslator, {
  combineDictionaries,
  Translation,
  TranslationDictionary,
} from "/translations"

export const useTranslator = <
  T extends Translation,
  U extends Translation = {},
  V extends Translation = {},
>(
  ...dicts:
    | [TranslationDictionary<T>]
    | [TranslationDictionary<T>, TranslationDictionary<U>]
    | [
        TranslationDictionary<T>,
        TranslationDictionary<U>,
        TranslationDictionary<V>,
      ]
) => {
  const router = useRouter()

  const combinedDict = combineDictionaries(dicts)
  /*[
    dicts[0],
    dicts[1] ?? {},
    dicts[2] ?? {},
  ])*/
  const translator = useMemo(
    () => getTranslator(combinedDict)(router?.locale ?? "fi", router),
    [dicts, router?.locale],
  )

  return translator
}
