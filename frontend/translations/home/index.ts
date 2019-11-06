import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type HomeTranslations = typeof en | typeof fi

export default getTranslator<HomeTranslations>({ en, fi })
