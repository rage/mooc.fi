import axios from "axios"
import * as winston from "winston"

import {
  RATELIMIT_PROTECTION_SAFE_API_KEY,
  TMC_CLIENT_ID,
  TMC_CLIENT_SECRET,
  TMC_FRONTEND_CLIENT_ID,
  TMC_FRONTEND_CLIENT_SECRET,
  TMC_HOST,
  TMC_PASSWORD,
  TMC_TOKEN_ISSUER_CLIENT_ID,
  TMC_TOKEN_ISSUER_CLIENT_SECRET,
  TMC_USERNAME,
} from "../config"
import { OrganizationInfo, UserInfo } from "../domain/UserInfo"
import { requestErrorLogFields } from "../util/requestErrorLogFields"
import { singleFlight } from "../util/singleFlight"

const TMC_TIMEOUT_MS = 5000

export interface UserFieldValue {
  id: number
  user_id: number
  field_name: string
  value: string
  created_at: string
  updated_at: string
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: "tmc" },
  transports: [new winston.transports.Console()],
})

const tmcAxios = axios.create({ timeout: TMC_TIMEOUT_MS })
// Bulk exports for the background sync scripts can legitimately take minutes.
const tmcBulkAxios = axios.create()

const RATE_LIMIT_BYPASS_HEADERS = {
  "RATELIMIT-PROTECTION-SAFE-API-KEY": RATELIMIT_PROTECTION_SAFE_API_KEY,
}
const FORM_HEADERS = {
  "content-type": "application/x-www-form-urlencoded",
  ...RATE_LIMIT_BYPASS_HEADERS,
}

let _accessToken: string | null = null

async function fetchAccessToken(): Promise<string> {
  logger.info("Fetching tmc access token...")
  try {
    const response = await tmcAxios.post(
      `${TMC_HOST}/oauth/token`,
      `client_secret=${TMC_CLIENT_SECRET}&client_id=${TMC_CLIENT_ID}&username=${encodeURIComponent(
        TMC_USERNAME ?? "",
      )}&password=${encodeURIComponent(
        TMC_PASSWORD ?? "",
      )}&grant_type=password`,
      {
        headers: FORM_HEADERS,
      },
    )

    return response.data.access_token
  } catch (error) {
    logger.error(
      "Fetching tmc access token failed",
      requestErrorLogFields(error),
    )
    return ""
  }
}

export async function getAccessToken() {
  if (_accessToken) {
    return _accessToken
  }
  _accessToken = await fetchAccessToken()
  return _accessToken
}

export async function getBasicInfoByUsernames(usernames: string[]) {
  const res = await tmcAxios.post(
    `${TMC_HOST}/api/v8/users/basic_info_by_usernames?extra_fields=elements-of-ai&user_fields=1`,
    {
      usernames: usernames,
    },
    {
      headers: { Authorization: `Bearer ${await getAccessToken()}` },
    },
  )
  return res.data
}

export default class TmcClient {
  accessToken: string | null

  constructor(accessToken: string | null = null) {
    this.accessToken = accessToken
  }

  async getCurrentUserDetails(): Promise<UserInfo> {
    const res = await tmcAxios.get(
      `${TMC_HOST}/api/v8/users/current?show_user_fields=1&extra_fields=1`,
      {
        headers: { Authorization: this.accessToken ?? "" },
      },
    )

    const userInfo = res.data

    return userInfo
  }

  async getUserDetailsById(id: number): Promise<UserInfo> {
    const res = await tmcAxios.get(
      `${TMC_HOST}/api/v8/users/${id}?show_user_fields=1&extra_fields=1`,
      {
        headers: { Authorization: `Bearer ${await getAccessToken()}` },
      },
    )

    const userInfo = res.data
    return userInfo
  }

  async getOrganizations(): Promise<OrganizationInfo[]> {
    const res = await tmcAxios.get(`${TMC_HOST}/api/v8/org.json`, {
      headers: { Authorization: `Bearer ${await getAccessToken()}` },
    })
    return res.data
  }

  async getUserAppDatum(after: string | null): Promise<any[]> {
    let res
    if (after != null) {
      after = encodeURI(after)
      res = await tmcBulkAxios.get(
        `${TMC_HOST}/api/v8/user_app_datum?after=${after}`,
        {
          headers: { Authorization: `Bearer ${await getAccessToken()}` },
        },
      )
    } else {
      res = await tmcBulkAxios.get(`${TMC_HOST}/api/v8/user_app_datum`, {
        headers: { Authorization: `Bearer ${await getAccessToken()}` },
      })
    }
    return res.data
  }

  async getUserFieldValues(after: string | null): Promise<UserFieldValue[]> {
    let res
    if (after != null) {
      after = encodeURI(after)
      res = await tmcBulkAxios.get(
        `${TMC_HOST}/api/v8/user_field_value?after=${after}`,
        {
          headers: { Authorization: `Bearer ${await getAccessToken()}` },
        },
      )
    } else {
      res = await tmcBulkAxios.get(`${TMC_HOST}/api/v8/user_field_value`, {
        headers: { Authorization: `Bearer ${await getAccessToken()}` },
      })
    }
    return res.data
  }
}

export const getCurrentUserDetails = async (
  accessToken: string,
): Promise<UserInfo> => {
  const res = await tmcAxios.get(
    `${TMC_HOST}/api/v8/users/current?show_user_fields=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  const userInfo = res.data
  return userInfo
}

const ISSUE_USER_ACCESS_TOKENS_SCOPE = "issue_user_access_tokens"
// Renew this long before TMC's expiry so an in-flight request never carries an expired token.
const ISSUER_TOKEN_EXPIRY_MARGIN_MS = 60_000

// expiresAt is null for a token TMC issued without expiry; a 401 still drops it.
let issuerToken: { value: string; expiresAt: number | null } | null = null

/** Whether {@link issueUserAccessToken} has the issuer credentials it needs. */
export const isUserAccessTokenIssuingConfigured = () =>
  Boolean(TMC_TOKEN_ISSUER_CLIENT_ID && TMC_TOKEN_ISSUER_CLIENT_SECRET)

function getIssuerAccessToken(): Promise<string> {
  if (
    issuerToken &&
    (issuerToken.expiresAt === null || issuerToken.expiresAt > Date.now())
  ) {
    return Promise.resolve(issuerToken.value)
  }
  // Shared, so a burst of handoffs fetches one issuer token, not one each.
  return singleFlight("tmc:issuer-access-token", fetchIssuerAccessToken)
}

async function fetchIssuerAccessToken(): Promise<string> {
  const res = await tmcAxios.post<{
    access_token: string
    expires_in?: number
  }>(
    `${TMC_HOST}/oauth/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: TMC_TOKEN_ISSUER_CLIENT_ID ?? "",
      client_secret: TMC_TOKEN_ISSUER_CLIENT_SECRET ?? "",
      scope: ISSUE_USER_ACCESS_TOKENS_SCOPE,
    }).toString(),
    {
      headers: FORM_HEADERS,
    },
  )
  const { access_token, expires_in } = res.data
  issuerToken = {
    value: access_token,
    expiresAt:
      typeof expires_in === "number"
        ? Date.now() + expires_in * 1000 - ISSUER_TOKEN_EXPIRY_MARGIN_MS
        : null,
  }
  return issuerToken.value
}

/**
 * TMC refuses to issue a token for this user (e.g. staff). A misconfigured issuer gets the same
 * 403, so `message` carries TMC's reason.
 */
export class UserAccessTokenRefusedError extends Error {}

const readTmcErrors = (body: any): string =>
  Array.isArray(body?.errors)
    ? body.errors.filter((e: unknown) => typeof e === "string").join("; ")
    : ""

/**
 * Signs a TMC user in without their password: a TMC access token for `upstreamId`, usable like
 * one a password sign-in on mooc.fi gives.
 *
 * Only for a user another system has vouched for, such as a redeemed courses.mooc.fi handoff.
 * Rejects with {@link UserAccessTokenRefusedError} when TMC will not issue one for the user, and
 * otherwise when issuing is not configured, TMC fails or the user does not exist. Any other
 * rejection may be an axios error, which carries the request headers: never log it whole.
 */
export async function issueUserAccessToken(
  upstreamId: number,
): Promise<string> {
  if (!isUserAccessTokenIssuingConfigured()) {
    throw new Error("TMC user access token issuing is not configured")
  }
  const request = (issuerAccessToken: string) =>
    tmcAxios.post<{ access_token?: unknown }>(
      `${TMC_HOST}/api/v8/application/user_access_tokens`,
      { user_id: upstreamId },
      {
        headers: {
          Authorization: `Bearer ${issuerAccessToken}`,
          ...RATE_LIMIT_BYPASS_HEADERS,
        },
      },
    )
  const requestWithFreshIssuerToken = async () => {
    const issuerAccessToken = await getIssuerAccessToken()
    return request(issuerAccessToken).catch(async (error) => {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        throw error
      }
      // The issuer token was revoked or expired early; another request may have renewed it already.
      if (issuerToken?.value === issuerAccessToken) {
        issuerToken = null
      }
      return request(await getIssuerAccessToken())
    })
  }

  let res
  try {
    res = await requestWithFreshIssuerToken()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new UserAccessTokenRefusedError(readTmcErrors(error.response.data))
    }
    throw error
  }
  const { access_token } = res.data
  if (typeof access_token !== "string" || access_token === "") {
    throw new Error("TMC answered without an access token")
  }
  return access_token
}

/**
 * Revokes a TMC access token of the frontend's sign-ins, so it stops working at TMC too.
 *
 * Does nothing when the frontend's OAuth application is not configured. Rejects when TMC fails;
 * the rejection may be an axios error, which carries the token: never log it whole.
 */
export async function revokeAccessToken(accessToken: string) {
  if (!TMC_FRONTEND_CLIENT_ID || !TMC_FRONTEND_CLIENT_SECRET) {
    return
  }
  // Doorkeeper revokes a confidential application's token only for that application's credentials.
  await tmcAxios.post(
    `${TMC_HOST}/oauth/revoke`,
    new URLSearchParams({
      token: accessToken,
      client_id: TMC_FRONTEND_CLIENT_ID,
      client_secret: TMC_FRONTEND_CLIENT_SECRET,
    }).toString(),
    {
      headers: FORM_HEADERS,
    },
  )
}
