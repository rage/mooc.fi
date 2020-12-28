// generated Mon Dec 28 2020 22:02:16 GMT+0200 (Eastern European Standard Time)

import en from "./en.json"
import fi from "./fi.json"
import { TranslationDictionary } from "/translations"

export type HomeTranslations = typeof en & typeof fi
const HomeTranslations: TranslationDictionary<HomeTranslations> = { en, fi }

export default HomeTranslations