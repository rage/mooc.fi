import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type CoursesTranslations = typeof en | typeof fi

export default getTranslator<CoursesTranslations>({ en, fi })
