import en from "./en.json"
import fi from "./fi.json"
import getTranslator from "/translations"

type OrganizationRegisterTranslations = typeof en | typeof fi

export default getTranslator<OrganizationRegisterTranslations>({ en, fi })
