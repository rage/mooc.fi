import axios from "axios"
import { maxBy } from "lodash"
import { DateTime } from "luxon"

import { OpenUniversityRegistrationLink } from "@prisma/client"

import prisma from "../prisma"
import { AvoinError } from "./lib/errors"
import sentryLogger from "./lib/logger"

require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const logger = sentryLogger({ service: "fetch-avoin-links" })

const processLink = async (p: OpenUniversityRegistrationLink) => {
  if (!p.course_code || p.course_code === "null") {
    logger.info(
      "Since this link has no course code, I won't try to fetch new links.",
    )
    return
  }
  const res = await getInfoWithCourseCode(p.course_code).catch((error) => {
    const e = new AvoinError(
      `Error getting info with course code ${p.course_code}`,
      p,
      error,
    )
    logger.error(e)
    throw e
  })
  logger.info("Open university info: " + JSON.stringify(res, undefined, 2))

  const now: DateTime = DateTime.fromJSDate(new Date())

  const alternatives = res
    .map((data) => {
      const linkStartDate: DateTime = DateTime.fromISO(data.alkupvm)
      const linkStopDate: DateTime = DateTime.fromISO(data.loppupvm)
      return {
        link: data.oodi_id,
        stopDate: linkStopDate,
        startTime: linkStartDate,
      } as Link
    })
    .filter((link) => Boolean(link.link))

  let openLinks = alternatives.filter(
    (o) => o.startTime < now && o.stopDate > now,
  )

  const bestLink = maxBy(openLinks, (o) => o.stopDate)

  if (!bestLink) {
    logger.warn("Did not find any open links")
    return
  }

  logger.info(`Best link found was: ${JSON.stringify(bestLink)}`)

  const url = `https://www.avoin.helsinki.fi/palvelut/esittely.aspx?s=${bestLink.link}`

  logger.info("Updating link to " + url)
  await prisma.openUniversityRegistrationLink.update({
    where: {
      id: p.id,
    },
    data: {
      link: { set: url },
      start_date: { set: bestLink.startTime.toJSDate() },
      stop_date: { set: bestLink.stopDate.toJSDate() },
    },
  })
}

const fetch = async () => {
  logger.info("Getting open university links from db...")
  const avoinObjects = await prisma.openUniversityRegistrationLink.findMany({})

  for (const p of avoinObjects) {
    logger.info(`Processing link ${p.link}, ${p.course_code}, ${p.language}`)
    try {
      await processLink(p)
    } catch (e: any) {
      logger.error(
        new AvoinError(
          `Processing link failed for course code ${p.course_code}`,
          p,
          e,
        ),
      )
    }
  }
  logger.info("Done")
  process.exit(0)
}

const getInfoWithCourseCode = async (
  course_code: string,
): Promise<AvoinLinkData[]> => {
  const url = process.env.AVOIN_COURSE_URL + course_code
  const res = await axios.get(url, {
    headers: { Authorized: "Basic " + process.env.AVOIN_TOKEN },
  })
  return await res.data
}

interface AvoinLinkData {
  oodi_id: string
  url: string
  alkupvm: string
  loppupvm: string
}

interface Link {
  link: string
  stopDate: DateTime
  startTime: DateTime
}

fetch().catch((error) => {
  if (error instanceof Error) {
    logger.error(error)
  } else {
    logger.error(new AvoinError("Error fetching", {}, error))
  }
  throw error
})
