import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type UsersTranslations = typeof en | typeof fi

export default getTranslator<UsersTranslations>({ en, fi })
