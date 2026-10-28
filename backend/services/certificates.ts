import axios from "axios"
import { Logger } from "winston"

import { CERTIFICATES_URL } from "../config"
import getRedisClient, { redisify } from "./redis"

const certificatesAxios = axios.create({ timeout: 2000 })

const AVAILABILITY_TTL_SECONDS = 300
const FAILURE_TTL_SECONDS = 60

/**
 * Cached certificate availability; `null` when the certificates service fails.
 * Failures are cached briefly so a slow or down service is not hit per completion.
 */
export const getCachedCertificateAvailability = async (
  key: string,
  fetchAvailability: () => Promise<any>,
  logger: Logger,
) => {
  const client = getRedisClient()
  const failureKey = `certificateavailability-failed:${key}`
  const redis = client?.isOpen ? client : undefined

  try {
    if (await redis?.get(failureKey)) {
      return null
    }
    return await redisify(
      fetchAvailability,
      {
        prefix: "certificateavailability",
        expireTime: AVAILABILITY_TTL_SECONDS,
        key,
        retry: false,
        throwOnError: true,
      },
      { logger },
    )
  } catch (error) {
    logger.warn(`Certificate availability failed for ${key}`, { error })
    await redis
      ?.set(failureKey, "1", { EX: FAILURE_TTL_SECONDS })
      .catch(() => {})
    return null
  }
}

export const checkCertificate = async (slug: string, accessToken: string) => {
  const res = await certificatesAxios.get(
    `${CERTIFICATES_URL}/certificate-availability/${slug}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return res?.data
}

export const checkCertificateForUser = async (
  slug: string,
  upstream_id: number,
  accessToken: string,
) => {
  const res = await certificatesAxios.get(
    `${CERTIFICATES_URL}/admin/certificate-availability/${slug}/${upstream_id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return res?.data
}

export const createCertificate = async (slug: string, accessToken: string) => {
  try {
    const res = await certificatesAxios.post(
      `${CERTIFICATES_URL}/create/${slug}`,
      undefined,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return res?.data
  } catch (e) {
    console.log(e)
    return null
  }
}

// TODO: create certificate for user, needs an endpoint in certificates as well
