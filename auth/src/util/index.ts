import { NextFunction, Request, Response } from "express"

export const encodeRelayState = (req: Request) => {
  const { provider, action } = req.params
  const language = req.query.language || req.params.language || "en"

  const relayState = Buffer.from(
    JSON.stringify({ language, provider, action }),
  ).toString("base64")

  return relayState
}

export const decodeRelayState = (state: string): Record<string, any> | null => {
  if (!state) {
    return null
  }

  return JSON.parse(Buffer.from(state, "base64").toString("utf-8"))
}

export const convertObjectKeysToLowerCase = <T extends Record<string, any>>(
  obj: T | undefined,
): T | undefined =>
  obj
    ? Object.entries(obj).reduce<T>(
        (acc, [key, value]) => ({ ...acc, [key.toLowerCase()]: value }),
        {} as T,
      )
    : undefined

export const setLocalCookiesMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    headers: { cookie },
  } = req
  res.locals.cookie =
    cookie?.split(";").reduce((res, item) => {
      const data = item.trim().split("=")
      return { ...res, [data[0]]: data[1] }
    }, {}) ?? {}
  next()
}
