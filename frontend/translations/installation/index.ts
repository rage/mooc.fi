import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type InstallationTranslations = typeof en | typeof fi

export default getTranslator<InstallationTranslations>({ en, fi })
