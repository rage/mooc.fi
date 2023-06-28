// generated Mon Jun 26 2023 18:20:38 GMT+0300 (Itä-Euroopan kesäaika)

import en from "./en"
import fi from "./fi"
import { TranslationDictionary } from "/translations"

export type Users = typeof en | typeof fi

const UsersTranslations = { en, fi } as TranslationDictionary<
  Users,
  { en: typeof en; fi: typeof fi }
>

export default UsersTranslations
