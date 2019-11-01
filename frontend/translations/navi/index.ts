import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type NaviTranslations = typeof en | typeof fi
export default getTranslator<NaviTranslations>({ en, fi })
