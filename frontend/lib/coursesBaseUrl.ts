/** Base URL of courses.mooc.fi, the new version of the platform. */
export const COURSES_BASE_URL =
  process.env.NEXT_PUBLIC_COURSES_BASE_URL ?? "https://courses.mooc.fi"

/** A courses.mooc.fi page opened in `language`, which it reads from the `lang` parameter. */
export const coursesPageUrl = (path: string, language: string | undefined) => {
  const url = new URL(path, COURSES_BASE_URL)
  if (language) {
    url.searchParams.set("lang", language)
  }
  return url.toString()
}
