import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type NaviTranslations = typeof en | typeof fi
export default getTranslator<NaviTranslations>({ en, fi })
// type Keys = keyof NaviTranslations

/* const dicts: { [lng: string]: NaviTranslations } = { en, fi }

function getNaviTranslator(lng: string) {
  const dictionary = dicts[lng] || {}
  const getTranslation = (key: string): object[] => {
    const value = dictionary[key as Keys]
    if (!value) {
      return dicts.en[key as Keys] || []
    }
    return value
  }
  return getTranslation
}

export default getNaviTranslator */
