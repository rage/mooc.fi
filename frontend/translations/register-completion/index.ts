// generated Wed Nov 23 2022 13:42:15 GMT+0200 (Itä-Euroopan normaaliaika)
import en from "./en.json"
import fi from "./fi.json"
import se from "./se.json"
import { TranslationDictionary } from "/translations"

export type RegisterCompletion = typeof en & typeof fi & typeof se

const RegisterCompletionTranslations: TranslationDictionary<RegisterCompletion> =
  { en, fi, se }

export default RegisterCompletionTranslations
