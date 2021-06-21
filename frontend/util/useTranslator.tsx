import { useRouter } from "next/router"
import { useContext, useMemo } from "react"
import LanguageContext from "/contexts/LanguageContext"
import getTranslator, {
  combineDictionaries,
  Translation,
  TranslationDictionary,
} from "/translations"

export const useTranslator = <
  T extends Translation,
  U extends Translation = {},
  V extends Translation = {}
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
  const { language } = useContext(LanguageContext)
  const router = useRouter()

  const combinedDict = combineDictionaries(dicts)
  /*[
    dicts[0],
    dicts[1] ?? {},
    dicts[2] ?? {},
  ])*/
  const translator = useMemo(
    () => getTranslator(combinedDict)(language, router),
    [dicts, language],
  )

  return translator
}
