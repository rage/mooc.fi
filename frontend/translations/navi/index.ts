import en from "./en.json"
import fi from "./fi.json"

type NaviTranslations = Partial<typeof en>
type Keys = keyof NaviTranslations

const dicts: { [lng: string]: NaviTranslations } = { en, fi }

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

export default getNaviTranslator
