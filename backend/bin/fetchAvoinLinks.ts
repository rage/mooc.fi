import {
  Prisma,
  OpenUniversityRegistrationLink,
} from "../generated/prisma-client"
import axios from "axios"
import { DateTime } from "luxon"

require("dotenv-safe").config()

const prisma: Prisma = new Prisma()

const fetch = async () => {
  const avoinObjects: OpenUniversityRegistrationLink[] = await prisma.openUniversityRegistrationLinks()

  avoinObjects.forEach(async p => {
    console.log("Processing link", p.course_code, p.language)
    const res = await getInfoWithCourseCode(p.course_code).catch(error => {
      console.log(error)
      throw error
    })
    console.log("Open university info: ", JSON.stringify(res, undefined, 2))
    const now: DateTime = DateTime.fromJSDate(new Date())
    let latestLink: Link = { link: null, stopDate: null }
    res.forEach(k => {
      const linkStartDate: DateTime = DateTime.fromISO(k.alkupvm)
      const linkStopDate: DateTime = DateTime.fromISO(k.loppupvm)
      if (linkStartDate < now) {
        if (linkStopDate > now && linkStopDate > latestLink.stopDate) {
          latestLink.link = k.oodi_id
          latestLink.stopDate = linkStopDate
        }
      }
    })
    const url =
      latestLink.link == null
        ? null
        : "https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=" +
          latestLink.link

    console.log("Updating link to", url)
    await prisma.updateOpenUniversityRegistrationLink({
      where: {
        id: p.id,
      },
      data: {
        link: url,
      },
    })
  })
}

const getInfoWithCourseCode = async (course_code: string): Promise<any[]> => {
  const url = process.env.AVOIN_COURSE_URL + course_code
  const res = await axios.get(url, {
    headers: { Authorized: "Basic " + process.env.AVOIN_TOKEN },
  })
  return await res.data
}

interface Link {
  link: string
  stopDate: DateTime
}

fetch().catch(error => {
  console.log(error)
  throw error
})
