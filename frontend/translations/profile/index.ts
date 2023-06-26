// generated Mon Jun 26 2023 18:20:38 GMT+0300 (Itä-Euroopan kesäaika)

import en from "./en"
import fi from "./fi"
import { TranslationDictionary } from "/translations"

export type Profile = typeof en | typeof fi

const ProfileTranslations = { en, fi } as TranslationDictionary<
  Profile,
  { en: typeof en; fi: typeof fi }
>

export default ProfileTranslations
