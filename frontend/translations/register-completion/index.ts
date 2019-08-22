import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type RegisterCompletionTranslations = typeof en | typeof fi

export default getTranslator<RegisterCompletionTranslations>({ en, fi })
/* type Keys = keyof RegisterCompletionTranslations

const dicts: { [lng: string]: RegisterCompletionTranslations } = { en, fi }

function getRegisterCompletionTranslator(lng: string) {
  const dictionary = dicts[lng] || {}
  const getTranslation = (key: string): string => {
    const value = dictionary[key as Keys]
    if (!value) {
      return dicts.en[key as Keys] || key
    }
    return value
  }
  return getTranslation
}

export default getRegisterCompletionTranslator */
