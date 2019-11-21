import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type SignUpTranslations = typeof en | typeof fi

export default getTranslator<SignUpTranslations>({ en, fi })
