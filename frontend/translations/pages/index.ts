import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type PageTranslations = typeof en | typeof fi
export default getTranslator<PageTranslations>({ en, fi })
