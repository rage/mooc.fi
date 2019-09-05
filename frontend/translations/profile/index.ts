import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type ProfileTranslations = typeof en | typeof fi

export default getTranslator<ProfileTranslations>({ en, fi })
/* type Keys = keyof ProfileTranslations

const dicts: { [lng: string]: ProfileTranslations } = { en, fi }

function getProfileTranslator(lng: string) {
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

export default getProfileTranslator */
