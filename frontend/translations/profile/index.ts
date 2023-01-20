// generated Wed Nov 23 2022 13:42:15 GMT+0200 (Itä-Euroopan normaaliaika)
import en from "./en.json"
import fi from "./fi.json"
import { TranslationDictionary } from "/translations"

export type Profile = typeof en & typeof fi

const ProfileTranslations: TranslationDictionary<Profile> = { en, fi }

export default ProfileTranslations
