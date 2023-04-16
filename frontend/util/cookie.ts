export const getCookie = (key: string) => {
  if (typeof document === "undefined" || !document || !document?.cookie) {
    return
  }

  const cookieString = decodeURIComponent(document.cookie)
  const found = cookieString.match("(^|[^;]+)s*" + key + "s*=s*([^;]+)")

  return found ? found.pop() ?? "" : ""
}
