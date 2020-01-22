import {
  Prisma,
  OpenUniversityRegistrationLink,
} from "../generated/prisma-client"
import axios from "axios"
import { DateTime } from "luxon"
import { maxBy } from "lodash"

require("dotenv-safe").config()

const prisma: Prisma = new Prisma()

const fetch = async () => {
  const avoinObjects: OpenUniversityRegistrationLink[] = await prisma.openUniversityRegistrationLinks()

  for (const p of avoinObjects) {
    console.log("Processing link", p.course_code, p.language)
    if (!p.course_code) {
      console.log(
        "Since this link has no course code, I won't try to fetch new links.",
      )
      continue
    }
    const res = await getInfoWithCourseCode(p.course_code).catch(error => {
      console.log(error)
      throw error
    })
    console.log("Open university info: ", JSON.stringify(res, undefined, 2))

    const now: DateTime = DateTime.fromJSDate(new Date())

    const alternatives = res.map(data => {
      const linkStartDate: DateTime = DateTime.fromISO(data.alkupvm)
      const linkStopDate: DateTime = DateTime.fromISO(data.loppupvm)
      return {
        link: data.oodi_id,
        stopDate: linkStopDate,
        startTime: linkStartDate,
      } as Link
    })

    let openLinks = alternatives.filter(
      o => o.startTime < now && o.stopDate > now,
    )

    const bestLink = maxBy(openLinks, o => o.stopDate)

    if (!bestLink) {
      console.log("Did not find any open links")
      continue
    }

    console.log(`Best link found was: ${JSON.stringify(bestLink)}`)

    const url = `https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=${bestLink.link}`

    console.log("Updating link to", url)
    await prisma.updateOpenUniversityRegistrationLink({
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

fetch().catch(error => {
  console.log(error)
  throw error
})
