import axios, { Method } from "axios"

interface RequestParams {
  data?: any
  headers?: any
  params?: Record<string, any>
}

export const createRequestHelpers = (port: number) => {
  const request =
    (method: Method) =>
    (route: string = "", defaultHeaders: any) =>
    async ({
      data = null,
      headers = defaultHeaders,
      params = {},
    }: RequestParams) =>
      axios({
        method,
        url: `http://localhost:${port}${route}`,
        data,
        headers,
        params,
      })

  const get = (route: string = "", defaultHeaders: any) =>
    request("GET")(route, defaultHeaders)
  const post = (route: string = "", defaultHeaders: any) =>
    request("POST")(route, defaultHeaders)
  const patch = (route: string = "", defaultHeaders: any) =>
    request("PATCH")(route, defaultHeaders)

  return {
    request,
    get,
    post,
    patch,
  }
}

export type RequestGet = ReturnType<
  ReturnType<typeof createRequestHelpers>["get"]
>
export type RequestPost = ReturnType<
  ReturnType<typeof createRequestHelpers>["post"]
>
