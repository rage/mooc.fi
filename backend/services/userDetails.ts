import { isAxiosError } from "axios"
import type { Logger } from "winston"

import { UserInfo } from "../domain/UserInfo"
import { hashUserToken } from "../util/hashUser"
import getRedisClient, { cacheGet, cacheSet } from "./redis"
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

/**
 * Resolves the TMC user behind a bearer token, cached per token.
 *
 * Resolves to `undefined` when TMC rejects the token or can't be reached; never
 * rejects. A token TMC answers 401 for isn't sent to TMC again for a minute.
 */
export async function getUserDetailsForToken(
  rawToken: string,
  { logger, client = getRedisClient() }: GetUserDetailsForTokenOptions,
): Promise<UserInfo | undefined> {
  const key = `${USER_DETAILS_PREFIX}:${hashUserToken(rawToken)}`
  const cacheOptions = { client, logger }

  const cached = await cacheGet(key, cacheOptions)
  if (cached === REJECTED_SENTINEL) {
    return undefined
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
    await cacheSet(
      key,
      JSON.stringify(userDetails),
      USER_DETAILS_EXPIRE_SECONDS,
      cacheOptions,
    )
    return userDetails
  } catch (e) {
    logger.warn("Error fetching user details", e)
    if (isAxiosError(e) && e.response?.status === 401) {
      await cacheSet(
        key,
        REJECTED_SENTINEL,
        REJECTED_TOKEN_EXPIRE_SECONDS,
        cacheOptions,
      )
    }
    return undefined
  }
}
