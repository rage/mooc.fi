// generated Tue Apr 13 2021 16:34:47 GMT+0300 (GMT+03:00)
import en from "./en.json"
import fi from "./fi.json"
import { TranslationDictionary } from "/translations"

export type HomeTranslations = typeof en & typeof fi
const HomeTranslations: TranslationDictionary<HomeTranslations> = { en, fi }

export default HomeTranslations
