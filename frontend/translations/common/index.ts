import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type SignInTranslations = typeof en | typeof fi

export default getTranslator<SignInTranslations>({ en, fi })
/* type Keys = keyof SignInTranslations

const dicts: { [lng: string]: SignInTranslations } = { en, fi }

function getSignInTranslator(lng: string) {
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

export default getSignInTranslator */
