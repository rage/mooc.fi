import axios from "axios"
import { Logger } from "winston"

import { CERTIFICATES_URL } from "../config"
import getRedisClient, { cacheGet, cacheSet } from "./redis"

const certificatesAxios = axios.create({ timeout: 2000 })

const AVAILABILITY_TTL_SECONDS = 300
const FAILURE_TTL_SECONDS = 60

const FAILED_SENTINEL = "failed"

/**
 * Cached certificate availability; `null` when the certificates service fails.
 * Failures are cached briefly so a slow or down service is not hit per completion.
 */
export const getCachedCertificateAvailability = async (
  key: string,
  fetchAvailability: () => Promise<any>,
  logger: Logger,
) => {
  const cacheKey = `certificateavailability:${key}`
  const cacheOptions = { client: getRedisClient(), logger }

  const cached = await cacheGet(cacheKey, cacheOptions)
  if (cached === FAILED_SENTINEL) {
    return null
  }
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      logger.warn(`Unparseable cached certificate availability for ${key}`)
    }
  }

  try {
    const availability = await fetchAvailability()
    if (typeof availability !== "undefined") {
      await cacheSet(
        cacheKey,
        JSON.stringify(availability),
        AVAILABILITY_TTL_SECONDS,
        cacheOptions,
      )
    }
    return availability
  } catch (error) {
    logger.warn(`Certificate availability failed for ${key}`, { error })
    await cacheSet(cacheKey, FAILED_SENTINEL, FAILURE_TTL_SECONDS, cacheOptions)
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
