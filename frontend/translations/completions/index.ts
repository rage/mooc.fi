// generated Sun Jun 25 2023 18:28:22 GMT+0300 (Itä-Euroopan kesäaika)

import en from "./en"
import fi from "./fi"
import { TranslationDictionary } from "/translations"

export type Completions = typeof en | typeof fi

const CompletionsTranslations = { en, fi } as TranslationDictionary<Completions>

export default CompletionsTranslations
