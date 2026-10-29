import en from "./en"
import fi from "./fi"
import { TranslationDictionary } from "/translations"

export type EmailTemplates = typeof en | typeof fi

const EmailTemplatesTranslations = { en, fi } as TranslationDictionary<
  EmailTemplates,
  { en: typeof en; fi: typeof fi }
>

export default EmailTemplatesTranslations
