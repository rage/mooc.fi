import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type CompletionsTranslations = typeof en | typeof fi

export default getTranslator<CompletionsTranslations>({ en, fi })
