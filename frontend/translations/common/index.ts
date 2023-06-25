// generated Sun Jun 25 2023 18:28:22 GMT+0300 (Itä-Euroopan kesäaika)

import en from "./en"
import fi from "./fi"
import se from "./se"
import { TranslationDictionary } from "/translations"

export type Common = typeof en | typeof fi | typeof se

const CommonTranslations = { en, fi, se } as TranslationDictionary<Common>

export default CommonTranslations
