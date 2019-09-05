import en from "./en.json"
import fi from "./fi.json"
import se from "./se.json"
import getTranslator from "/translations"

type SignInTranslations = typeof en | typeof fi | typeof se

export default getTranslator<SignInTranslations>({ en, fi, se })
