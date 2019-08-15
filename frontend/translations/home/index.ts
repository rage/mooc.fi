import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type HomeTranslations = typeof en | typeof fi // Partial<typeof en>

export default getTranslator<HomeTranslations>({ en, fi })
/* type Keys = keyof HomeTranslations

const dicts: { [lng: string]: HomeTranslations } = { en, fi }

function getHomeTranslator(lng: string) {
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

export default getHomeTranslator */
