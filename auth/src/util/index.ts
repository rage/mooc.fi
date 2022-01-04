import { NextFunction, Request, Response } from "express"

export const encodeRelayState = (req: Request) => {
  const { provider, action } = req.params || req.query
  const language = req.query.language || req.params.language || "en"

  const relayState = JSON.stringify({ language, provider, action })

  return relayState
}

export const decodeRelayState = (req: Request): Record<string, any> | null => {
  const state = req.body.RelayState || req.query.RelayState

  if (!state) {
    return null
  }

  return JSON.parse(state)
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

export const convertKeyToSingleLine = (s: string) =>
  s.replace(/-----(.*)-----/g, "").replace(/\n/g, "")

export type Optional<T> = T | undefined | null
