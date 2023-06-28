// generated Mon Jun 26 2023 18:20:38 GMT+0300 (Itä-Euroopan kesäaika)

import en from "./en"
import fi from "./fi"
import { TranslationDictionary } from "/translations"

export type Courses = typeof en | typeof fi

const CoursesTranslations = { en, fi } as TranslationDictionary<
  Courses,
  { en: typeof en; fi: typeof fi }
>

export default CoursesTranslations
