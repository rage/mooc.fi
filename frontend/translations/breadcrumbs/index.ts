// generated Wed Nov 23 2022 13:42:15 GMT+0200 (Itä-Euroopan normaaliaika)
import en from "./en.json"
import fi from "./fi.json"
import { TranslationDictionary } from "/translations"

export type Breadcrumbs = typeof en & typeof fi

const BreadcrumbsTranslations: TranslationDictionary<Breadcrumbs> = { en, fi }

export default BreadcrumbsTranslations
