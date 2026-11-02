import axios from "axios"
import * as winston from "winston"

import {
  RATELIMIT_PROTECTION_SAFE_API_KEY,
  TMC_CLIENT_ID,
  TMC_CLIENT_SECRET,
  TMC_HOST,
  TMC_PASSWORD,
  TMC_TOKEN_ISSUER_CLIENT_ID,
  TMC_TOKEN_ISSUER_CLIENT_SECRET,
  TMC_USERNAME,
} from "../config"
import { OrganizationInfo, UserInfo } from "../domain/UserInfo"

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
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "RATELIMIT-PROTECTION-SAFE-API-KEY":
            RATELIMIT_PROTECTION_SAFE_API_KEY,
        },
      },
    )

    return response.data.access_token
  } catch (error) {
    logger.error(error)
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

let issuerToken: { value: string; expiresAt: number } | null = null

export const isUserAccessTokenIssuingConfigured = () =>
  Boolean(TMC_TOKEN_ISSUER_CLIENT_ID && TMC_TOKEN_ISSUER_CLIENT_SECRET)

async function getIssuerAccessToken(): Promise<string> {
  if (issuerToken && issuerToken.expiresAt > Date.now()) {
    return issuerToken.value
  }
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
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "RATELIMIT-PROTECTION-SAFE-API-KEY": RATELIMIT_PROTECTION_SAFE_API_KEY,
      },
    },
  )
  const lifetimeMs = (res.data.expires_in ?? 0) * 1000
  issuerToken = {
    value: res.data.access_token,
    expiresAt: Date.now() + lifetimeMs - ISSUER_TOKEN_EXPIRY_MARGIN_MS,
  }
  return issuerToken.value
}

/** TMC refuses to issue a token for this user, e.g. staff, who must sign in with a password. */
export class UserAccessTokenRefusedError extends Error {}

export interface UserAccessToken {
  access_token: string
  /** Seconds; unlike a password sign-in's token, an issued one expires. */
  expires_in: number | null
}

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
): Promise<UserAccessToken> {
  if (!isUserAccessTokenIssuingConfigured()) {
    throw new Error("TMC user access token issuing is not configured")
  }
  const request = async () =>
    tmcAxios.post<{ access_token?: unknown; expires_in?: unknown }>(
      `${TMC_HOST}/api/v8/application/user_access_tokens`,
      { user_id: upstreamId },
      {
        headers: {
          Authorization: `Bearer ${await getIssuerAccessToken()}`,
          "RATELIMIT-PROTECTION-SAFE-API-KEY":
            RATELIMIT_PROTECTION_SAFE_API_KEY,
        },
      },
    )
  const statusOf = (error: unknown) =>
    axios.isAxiosError(error) ? error.response?.status : undefined

  let res
  try {
    res = await request()
  } catch (error) {
    if (statusOf(error) === 403) {
      throw new UserAccessTokenRefusedError()
    }
    if (statusOf(error) !== 401) {
      throw error
    }
    // The cached issuer token was revoked or expired early.
    issuerToken = null
    try {
      res = await request()
    } catch (retryError) {
      throw statusOf(retryError) === 403
        ? new UserAccessTokenRefusedError()
        : retryError
    }
  }
  return parseUserAccessToken(res.data)
}

const parseUserAccessToken = ({
  access_token,
  expires_in,
}: {
  access_token?: unknown
  expires_in?: unknown
}): UserAccessToken => {
  if (typeof access_token !== "string" || access_token === "") {
    throw new Error("TMC answered without an access token")
  }
  return {
    access_token,
    expires_in:
      typeof expires_in === "number" && expires_in > 0 ? expires_in : null,
  }
}
