// generated Mon Jun 26 2023 18:20:38 GMT+0300 (Itä-Euroopan kesäaika)

import en from "./en"
import fi from "./fi"
import se from "./se"
import { TranslationDictionary } from "/translations"

export type RegisterCompletion = typeof en | typeof fi | typeof se

const RegisterCompletionTranslations = { en, fi, se } as TranslationDictionary<
  RegisterCompletion,
  { en: typeof en; fi: typeof fi; se: typeof se }
>

export default RegisterCompletionTranslations
