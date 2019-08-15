import en from "./en.json"
import fi from "./fi.json"

type SignInTranslations = Partial<typeof en>
type Keys = keyof SignInTranslations

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

export default getSignInTranslator
