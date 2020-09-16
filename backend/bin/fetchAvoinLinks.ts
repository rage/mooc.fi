import axios from "axios"
import { DateTime } from "luxon"
import { maxBy } from "lodash"
import prismaClient from "./lib/prisma"
import sentryLogger from "./lib/logger"
import { OpenUniversityRegistrationLink } from "nexus-plugin-prisma/client"

require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})

const prisma = prismaClient()

const logger = sentryLogger({ service: "fetch-avoin-links" })

const processLink = async (p: OpenUniversityRegistrationLink) => {
  if (!p.course_code) {
    logger.info(
      "Since this link has no course code, I won't try to fetch new links.",
    )
    return
  }
  const res = await getInfoWithCourseCode(p.course_code).catch((error) => {
    logger.error(error)
    throw error
  })
  logger.info("Open university info: " + JSON.stringify(res, undefined, 2))

  const now: DateTime = DateTime.fromJSDate(new Date())

  const alternatives = res.map((data) => {
    const linkStartDate: DateTime = DateTime.fromISO(data.alkupvm)
    const linkStopDate: DateTime = DateTime.fromISO(data.loppupvm)
    return {
      link: data.oodi_id,
      stopDate: linkStopDate,
      startTime: linkStartDate,
    } as Link
  })

  let openLinks = alternatives.filter(
    (o) => o.startTime < now && o.stopDate > now,
  )

  const bestLink = maxBy(openLinks, (o) => o.stopDate)

  if (!bestLink) {
    logger.warn("Did not find any open links")
    return
  }

  logger.info(`Best link found was: ${JSON.stringify(bestLink)}`)

  const url = `https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=${bestLink.link}`

  logger.info("Updating link to " + url)
  await prisma.openUniversityRegistrationLink.update({
    where: {
      id: p.id,
    },
    data: {
      link: url,
      start_date: bestLink.startTime.toJSDate(),
      stop_date: bestLink.stopDate.toJSDate(),
    },
  })
}

const fetch = async () => {
  const avoinObjects = await prisma.openUniversityRegistrationLink.findMany({})

  for (const p of avoinObjects) {
    logger.info(`Processing link ${p.link}, ${p.course_code}, ${p.language}`)
    try {
      await processLink(p)
    } catch (e) {
      logger.error("Processing link failed.")
    }
  }
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
  logger.error(error)
  throw error
})
