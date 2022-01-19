import { NextFunction, Request, Response } from "express"
import { XMLParser } from "fast-xml-parser"

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

// https://github.com/espoon-voltti/evaka/blob/master/apigw/src/shared/routes/auth/saml/error-utils.ts
// https://github.com/espoon-voltti/evaka/blob/master/apigw/src/shared/routes/auth/saml/types.ts
export interface PassportSamlError extends Error {
  statusXml?: string
}

export type PrimaryStatusCodeValue =
  | "urn:oasis:names:tc:SAML:2.0:status:Success"
  | "urn:oasis:names:tc:SAML:2.0:status:Requester"
  | "urn:oasis:names:tc:SAML:2.0:status:Responder"
  | "urn:oasis:names:tc:SAML:2.0:status:VersionMismatch"

export type SecondaryStatusCodeValue =
  | "urn:oasis:names:tc:SAML:2.0:status:AuthnFailed"

export interface StatusObject {
  Status: {
    StatusCode: {
      "@_Value": PrimaryStatusCodeValue
      StatusCode?: {
        "@_Value": SecondaryStatusCodeValue
      }
    }
    StatusMessage: string
  }
}

function trimStatusCodePrefix(
  statusCode: PrimaryStatusCodeValue | SecondaryStatusCodeValue,
): string {
  return statusCode.replace("urn:oasis:names:tc:SAML:2.0:status:", "")
}

function parsePrimaryStatus(status: StatusObject): string {
  const primaryCode = status.Status.StatusCode["@_Value"]
  return trimStatusCodePrefix(primaryCode)
}

function parseSecondaryStatus(status: StatusObject): string {
  const secondaryCode = status.Status.StatusCode.StatusCode?.["@_Value"]
  if (!secondaryCode) {
    return "No secondary status code."
  }
  return trimStatusCodePrefix(secondaryCode)
}

function parseErrorMessage(status: StatusObject): string {
  return status.Status.StatusMessage
}

export function parseDescriptionFromSamlError(
  error: PassportSamlError,
  req: Request,
): string | undefined {
  if (!error.statusXml) {
    return
  }
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseAttributeValue: true,
  })
  const statusObject: StatusObject = parser.parse(error.statusXml)

  if (!statusObject) {
    console.error(
      "Failed to parse status object from XML",
      req,
      undefined,
      new Error("Failed to parse status object from XML"),
    )
    return
  }

  return (
    `Primary status code: ${parsePrimaryStatus(statusObject)}, ` +
    `secondary status code: ${parseSecondaryStatus(statusObject)}, ` +
    `error message: ${parseErrorMessage(statusObject)}`
  )
}

export const convertKeyToSingleLine = (s: string) =>
  s.replace(/-----(.*)-----/g, "").replace(/\n/g, "")

export type Optional<T> = T | undefined | null
