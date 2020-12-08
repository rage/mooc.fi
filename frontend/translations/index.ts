import { NextRouter } from "next/router"

const defaultLanguage = "en"

export type Translation =
  | Record<string, string>
  | Record<string, Array<Record<string, string>>>
  | Record<string, Record<string, string>>

const getTranslator = <T extends Translation>(dicts: Record<string, T>) => (
  lng: string,
  router?: NextRouter,
) => (key: keyof T, variables?: Record<string, any>) => {
  const translation: T[keyof T] | undefined =
    dicts[lng]?.[key] || dicts[defaultLanguage]?.[key]

  if (!translation) {
    console.warn(`WARNING: no translation for ${lng}:${key}`)
    return key
  }

  return Array.isArray(translation)
    ? (translation as T[keyof T][]).map((t) =>
        substitute<T>({ translation: t, variables, router }),
      )
    : substitute<T>({ translation, variables, router })
}

interface Substitute<T> {
  translation: T[keyof T]
  variables?: Record<string, any>
  router?: NextRouter
}

const substitute = <T>({
  translation,
  variables,
  router,
}: Substitute<T>): any => {
  if (typeof translation === "object") {
    return Object.keys(translation).reduce(
      (obj, key) => ({
        ...obj,
        [key]: substitute<T>({
          translation: (translation as any)[key],
          variables,
          router,
        }),
      }),
      {},
    )
  }

  if (typeof translation !== "string") {
    console.warn(
      `WARNING: translation only supports strings or objects - got ${translation} of type ${typeof translation}`,
    )

    return translation
  }

  const replaceGroups = translation.match(/{{(.*?)}}/gm)
  const keyGroups = translation.match(/\[\[(.*?)\]\]/gm)

  let ret: string = translation

  if (!replaceGroups && !keyGroups) {
    return ret
  }

  if (keyGroups) {
    if (!router && process.browser) {
      console.warn(
        `WARNING: no router given to translator - needed to access query parameters in ${translation}`,
      )
    }
    keyGroups?.forEach((g: string) => {
      const key = g.slice(2, g.length - 2)
      const replaceRegExp = new RegExp(`\\[\\[${key}\\]\\]`, "g")
      const queryParam = router?.query?.[key] ?? "..."

      if (!queryParam) {
        console.warn(
          `WARNING: no query param ${key} found for translation ${translation}`,
        )
      }

      ret = ret.replace(
        replaceRegExp,
        Array.isArray(queryParam) ? queryParam[0] : queryParam,
      )
    })
  }

  if (!variables && replaceGroups) {
    console.warn(
      `WARNING: no variables present for translation string "${translation}"`,
    )
    return ret
  }

  ;(replaceGroups || []).forEach((g: string) => {
    const key = g.slice(2, g.length - 2)
    const variable = (variables || {})[key]

    if (variable === null || variable === undefined) {
      console.warn(
        `WARNING: no variable present for translation string "${translation}" and key "${key}"`,
      )
    } else {
      const replaceRegExp = new RegExp(`{{${key}}}`, "g")
      ret = ret.replace(replaceRegExp, `${variable}`)
    }
  })

  return ret
}

export default getTranslator
