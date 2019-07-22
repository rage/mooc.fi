import {
  Prisma,
  OpenUniversityRegistrationLink,
} from "../generated/prisma-client"
import axios from "axios"

require("dotenv-safe").config()

const prisma: Prisma = new Prisma()

const fetch = async () => {
  const avoinObjects: OpenUniversityRegistrationLink[] = await prisma.openUniversityRegistrationLinks()
  console.log(await getInfoWithCourseCode("AYTKT21018"))
}

const getInfoWithCourseCode = async (course_code: string) => {
  const url = process.env.AVOIN_COURSE_URL + course_code
  const res = await axios.get(url, {
    headers: { Authorized: "Basic " + process.env.AVOIN_TOKEN },
  })
  return res
}

fetch()
