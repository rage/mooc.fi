import { stripDiacritics } from "./stripDiacritics"

export const slugify = (text: string) =>
  stripDiacritics(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
