// generated Mon Jun 26 2023 18:20:38 GMT+0300 (Itä-Euroopan kesäaika)

import en from "./en"
import fi from "./fi"
import { TranslationDictionary } from "/translations"

export type StudyModules = typeof en | typeof fi

const StudyModulesTranslations = { en, fi } as TranslationDictionary<
  StudyModules,
  { en: typeof en; fi: typeof fi }
>

export default StudyModulesTranslations
