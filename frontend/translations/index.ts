const defaultLanguage = "en"

type Translation = {
  [key: string]: string | { [key2: string]: string }[]
}

const getTranslator = <T extends Translation>(dicts: { [lang: string]: T }) => (
  lng: string,
) => (key: keyof T, variables?: { [key: string]: any }) => {
  const translation: T | keyof T | T[keyof T] =
    (dicts[lng] || {})[key] || (dicts[defaultLanguage] || {})[key] || key

  return Array.isArray(translation)
    ? translation.map(t => substitute<T>(t, variables))
    : substitute<T>(translation, variables)
}

const substitute = <T>(
  translation: T | keyof T | T[keyof T],
  variables?: { [key: string]: any },
): any => {
  if (typeof translation === "object") {
    return Object.keys(translation).reduce(
      (obj, key) => ({
        ...obj,
        // @ts-ignore
        [key]: substitute(translation[key], variables),
      }),
      {},
    )
  }

  const groups = (translation as string).match(/{{(.*?)}}/gm)

  if (!groups) {
    return translation
  }

  if (!variables) {
    console.warn(
      `WARNING: no variables present for translation string "${translation}"`,
    )
    return translation
  }

  let ret = translation as string
  ;(groups || []).forEach((g: string) => {
    const key = (g.match(/{{(.*?)}}/) || [])[1]
    const variable = (variables || {})[key]

    if (!variable) {
      console.warn(
        `WARNING: no variable present for translation string "${translation}" and key "${key}"`,
      )
    } else {
      ret = ret.replace(`{{${key}}}`, `${variable}`)
    }
  })

  return ret
}

export default getTranslator
