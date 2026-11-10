/** Origin of the mooc.fi backend's REST API, for `fetch` from the browser. */
export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.mooc.fi"
    : (process.env.NEXT_PUBLIC_DEV_BACKEND_URL ?? "http://localhost:4000")
