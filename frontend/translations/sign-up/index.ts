import en from "./en.json"
import fi from "./fi.json"

type SignUpTranslations = Partial<typeof en>
type Keys = keyof SignUpTranslations

const dicts: { [lng: string]: SignUpTranslations } = { en, fi }

function getSignUpTranslator(lng: string) {
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

export default getSignUpTranslator
