// generated Wed Nov 23 2022 13:42:15 GMT+0200 (Itä-Euroopan normaaliaika)
import en from "./en.json"
import fi from "./fi.json"
import { TranslationDictionary } from "/translations"

export type Installation = typeof en & typeof fi

const InstallationTranslations: TranslationDictionary<Installation> = { en, fi }

export default InstallationTranslations
