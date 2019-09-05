const defaultLanguage = "en"

type Translation = {
  [key: string]: string | { [key2: string]: string }[]
}

const getTranslator = <T extends Translation>(dicts: { [lang: string]: T }) => (
  lng: string,
) => (key: keyof T) =>
  (dicts[lng] || {})[key] || (dicts[defaultLanguage] || {})[key] || key

export default getTranslator
