import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type TeachersTranslations = typeof en | typeof fi

export default getTranslator<TeachersTranslations>({ en, fi })
