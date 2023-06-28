// generated Mon Jun 26 2023 18:20:38 GMT+0300 (Itä-Euroopan kesäaika)

import en from "./en"
import fi from "./fi"
import { TranslationDictionary } from "/translations"

export type Breadcrumbs = typeof en | typeof fi

const BreadcrumbsTranslations = { en, fi } as TranslationDictionary<
  Breadcrumbs,
  { en: typeof en; fi: typeof fi }
>

export default BreadcrumbsTranslations
