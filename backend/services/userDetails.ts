import { isAxiosError } from "axios"
import type { Logger } from "winston"

import { UserInfo } from "../domain/UserInfo"
import { hashUserToken } from "../util/hashUser"
import { requestErrorLogFields } from "../util/requestErrorLogFields"
import getRedisClient, {
  cacheDel,
  cacheGet,
  cacheSet,
  cacheSetIfAbsent,
} from "./redis"
import TmcClient from "./tmc"

const USER_DETAILS_PREFIX = "userdetails"
const USER_DETAILS_EXPIRE_SECONDS = 3600
const REJECTED_SENTINEL = "rejected"
const REJECTED_TOKEN_EXPIRE_SECONDS = 60

type RedisClient = ReturnType<typeof getRedisClient>

interface GetUserDetailsForTokenOptions {
  logger: Logger
  client?: RedisClient
}

const userDetailsKey = (rawToken: string) =>
  `${USER_DETAILS_PREFIX}:${hashUserToken(rawToken)}`

/**
 * Drops what {@link getUserDetailsForToken} cached for a token, so its next use asks TMC again.
 * Never rejects. For a signed-out token, see {@link rejectSignedOutToken}.
 */
export const forgetUserDetailsForToken = (
  rawToken: string,
  { logger, client = getRedisClient() }: GetUserDetailsForTokenOptions,
) => cacheDel(userDetailsKey(rawToken), { client, logger })

/**
 * Makes {@link getUserDetailsForToken} reject a signed-out token at once rather than when its
 * cached details expire, even if a request in flight caches them again. Never rejects.
 */
export const rejectSignedOutToken = (
  rawToken: string,
  { logger, client = getRedisClient() }: GetUserDetailsForTokenOptions,
) =>
  cacheSet(
    userDetailsKey(rawToken),
    REJECTED_SENTINEL,
    REJECTED_TOKEN_EXPIRE_SECONDS,
    { client, logger },
  )

/**
 * Resolves the TMC user behind a bearer token, cached per token.
 *
 * Resolves to `"rejected"` when TMC rejects the token and `"unavailable"` when TMC can't be
 * asked; never rejects. A rejected token isn't sent to TMC again for a minute.
 */
export async function getUserDetailsForToken(
  rawToken: string,
  { logger, client = getRedisClient() }: GetUserDetailsForTokenOptions,
): Promise<UserInfo | "rejected" | "unavailable"> {
  const key = userDetailsKey(rawToken)
  const cacheOptions = { client, logger }

  const cached = await cacheGet(key, cacheOptions)
  if (cached === REJECTED_SENTINEL) {
    return "rejected"
  }
  if (cached) {
    try {
      return JSON.parse(cached) as UserInfo
    } catch {
      logger.warn("Unparseable cached user details")
    }
  }

  try {
    const userDetails = await new TmcClient(rawToken).getCurrentUserDetails()
    // Not over a sentinel written meanwhile, such as by a sign-out while TMC was answering.
    await cacheSetIfAbsent(
      key,
      JSON.stringify(userDetails),
      USER_DETAILS_EXPIRE_SECONDS,
      cacheOptions,
    )
    return userDetails
  } catch (e) {
    logger.warn("Error fetching user details", requestErrorLogFields(e))
    if (isAxiosError(e) && e.response?.status === 401) {
      await cacheSet(
        key,
        REJECTED_SENTINEL,
        REJECTED_TOKEN_EXPIRE_SECONDS,
        cacheOptions,
      )
      return "rejected"
    }
    return "unavailable"
  }
}
