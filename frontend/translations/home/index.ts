// generated Wed Nov 23 2022 13:42:15 GMT+0200 (Itä-Euroopan normaaliaika)
import en from "./en.json"
import fi from "./fi.json"
import { TranslationDictionary } from "/translations"

export type Home = typeof en & typeof fi

const HomeTranslations: TranslationDictionary<Home> = { en, fi }

export default HomeTranslations
