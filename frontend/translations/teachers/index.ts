// generated Wed Nov 23 2022 13:42:15 GMT+0200 (Itä-Euroopan normaaliaika)

import en from "./en.json"
import fi from "./fi.json"
import { TranslationDictionary } from "/translations"

export type Teachers = typeof en & typeof fi

const TeachersTranslations: TranslationDictionary<Teachers> = { en, fi }

export default TeachersTranslations
