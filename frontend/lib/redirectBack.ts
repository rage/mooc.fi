/**
 * Whether a post-login redirect target stays on this site.
 *
 * Accepts only root-relative paths. `//host` and `/\host` are rejected because browsers
 * treat them as protocol-relative, and control characters because the URL parser strips
 * tabs and newlines, which would turn `/\t/host` into `//host`.
 * Keep in sync with `assertJoinConfirmationOptions` in
 * backend/schema/UserOrganization/helpers.ts.
 */
export const isSafeRedirectPath = (url: unknown): url is string =>
  typeof url === "string" &&
  url.startsWith("/") &&
  url[1] !== "/" &&
  url[1] !== "\\" &&
  !/[\u0000-\u001f\u007f]/.test(url)
