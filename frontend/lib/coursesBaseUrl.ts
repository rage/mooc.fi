/** Base URL of courses.mooc.fi, the new version of the platform. */
export const COURSES_BASE_URL =
  process.env.NEXT_PUBLIC_COURSES_BASE_URL ?? "https://courses.mooc.fi"

/** A courses.mooc.fi page opened in `language`, which it reads from the `lang` parameter. */
export const coursesPageUrl = (path: string, language: string | undefined) =>
  language
    ? `${COURSES_BASE_URL}${path}?${new URLSearchParams({ lang: language })}`
    : `${COURSES_BASE_URL}${path}`
