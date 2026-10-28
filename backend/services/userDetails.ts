import { isAxiosError } from "axios"
import type { Logger } from "winston"

import { UserInfo } from "../domain/UserInfo"
import { hashUserToken } from "../util/hashUser"
import getRedisClient, { redisify } from "./redis"
import TmcClient from "./tmc"

const USER_DETAILS_PREFIX = "userdetails"
const USER_DETAILS_EXPIRE_SECONDS = 3600
const REJECTED_TOKEN_PREFIX = "userdetails-rejected"
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
  const key = hashUserToken(rawToken)

  return redisify<UserInfo | undefined>(
    async () => {
      if (await isTokenRejected(client, key, logger)) {
        return undefined
      }
      try {
        return await new TmcClient(rawToken).getCurrentUserDetails()
      } catch (e) {
        logger.warn("Error fetching user details", e)
        if (isAxiosError(e) && e.response?.status === 401) {
          await markTokenRejected(client, key, logger)
        }
        return undefined
      }
    },
    {
      prefix: USER_DETAILS_PREFIX,
      expireTime: USER_DETAILS_EXPIRE_SECONDS,
      key,
    },
    { logger, client },
  )
}

const isTokenRejected = async (
  client: RedisClient,
  key: string,
  logger: Logger,
) => {
  if (!client?.isOpen) {
    return false
  }
  try {
    return Boolean(await client.get(`${REJECTED_TOKEN_PREFIX}:${key}`))
  } catch (e) {
    logger.warn("Failed to read rejected token cache", e)
    return false
  }
}

const markTokenRejected = async (
  client: RedisClient,
  key: string,
  logger: Logger,
) => {
  if (!client?.isOpen) {
    return
  }
  try {
    await client.set(`${REJECTED_TOKEN_PREFIX}:${key}`, "1", {
      EX: REJECTED_TOKEN_EXPIRE_SECONDS,
    })
  } catch (e) {
    logger.warn("Failed to cache rejected token", e)
  }
}
