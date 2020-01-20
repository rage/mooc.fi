import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type StudyModulesTranslations = typeof en | typeof fi

export default getTranslator<StudyModulesTranslations>({ en, fi })
