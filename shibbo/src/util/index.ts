import { Request } from "express"

export const encodeRelayState = (req: Request) => {
  const { provider, action } = req.params
  const language = req.query.language || req.params.language || "en"

  const relayState = Buffer.from(
    JSON.stringify({ language, provider, action }),
  ).toString("base64")

  return relayState
}

export const decodeRelayState = (state: string) => {
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
