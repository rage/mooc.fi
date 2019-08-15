import en from "./en.json"
import fi from "./fi.json"

type TeachersTranslations = Partial<typeof en>
type Keys = keyof TeachersTranslations

const dicts: { [lng: string]: TeachersTranslations } = { en, fi }

function getTeachersTranslator(lng: string) {
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

export default getTeachersTranslator
