import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type FAQTranslations = typeof en & typeof fi

export default getTranslator<FAQTranslations>({ en, fi })
