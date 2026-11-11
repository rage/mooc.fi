import axios from "axios"
import { Logger } from "winston"

import { CERTIFICATES_URL } from "../config"
import { requestErrorLogFields } from "../util/requestErrorLogFields"
import { inFlightFor, singleFlight } from "../util/singleFlight"
import getRedisClient, {
  cacheExpire,
  cacheGet,
  cacheSet,
  cacheSetIfAbsent,
} from "./redis"

const certificatesAxios = axios.create({ timeout: 2000 })

const AVAILABILITY_TTL_SECONDS = 300
const FAILURE_TTL_SECONDS = 60
const FRESH_INTERVAL_SECONDS = 10

const FAILED_SENTINEL = "failed"

/**
 * Cached certificate availability; `null` when the certificates service fails.
 * Failures are cached briefly so a slow or down service is not hit per completion.
 *
 * `fresh` skips the cached value and replaces it, for when the student has just created a
 * certificate or asks to try again; at most once per key in {@link FRESH_INTERVAL_SECONDS}. One
 * asked sooner gets the cached value, which then expires by the time the next one is allowed.
 */
export const getCachedCertificateAvailability = async (
  key: string,
  fetchAvailability: () => Promise<any>,
  logger: Logger,
  { fresh = false }: { fresh?: boolean } = {},
) => {
  const cacheKey = `certificateavailability:${key}`
  const freshKey = `${cacheKey}:fresh`
  const cacheOptions = { client: getRedisClient(), logger }

  const isFresh =
    fresh &&
    (await cacheSetIfAbsent(
      freshKey,
      "1",
      FRESH_INTERVAL_SECONDS,
      cacheOptions,
    ))
  // Completions of one course share a key, so all but the first fresh one join its fetch.
  const freshInFlight = fresh && !isFresh ? inFlightFor(freshKey) : undefined
  if (freshInFlight) {
    return freshInFlight
  }
  if (fresh && !isFresh) {
    await cacheExpire(cacheKey, FRESH_INTERVAL_SECONDS, cacheOptions)
  }
  const cached = isFresh ? null : await cacheGet(cacheKey, cacheOptions)
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

  // A fetch that started before, say, the certificate was created must neither be joined by a
  // fresh one nor overwrite its result.
  const write = isFresh ? cacheSet : cacheSetIfAbsent
  return singleFlight(isFresh ? freshKey : cacheKey, async () => {
    try {
      const availability = await fetchAvailability()
      if (typeof availability !== "undefined") {
        await write(
          cacheKey,
          JSON.stringify(availability),
          AVAILABILITY_TTL_SECONDS,
          cacheOptions,
        )
      }
      return availability
    } catch (error) {
      logger.warn(
        `Certificate availability failed for ${key}`,
        requestErrorLogFields(error),
      )
      await write(cacheKey, FAILED_SENTINEL, FAILURE_TTL_SECONDS, cacheOptions)
      return null
    }
  })
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
    console.log("Creating a certificate failed", requestErrorLogFields(e))
    return null
  }
}

// TODO: create certificate for user, needs an endpoint in certificates as well
