require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import { uniqBy } from "lodash"
import { PrismaClient } from "@prisma/client"
import TmcClient from "../services/tmc"

const tmc = new TmcClient()
const prisma = new PrismaClient()

const doIt = async () => {
  const data = await tmc.getUserAppDatum(null)
  console.log(data)
  let x = data.filter(
    (p) =>
      p.namespace === "elements-of-ai" &&
      p.field_name == "language" &&
      p.value == "se",
  )
  x = uniqBy(x, (p) => p.user_id)
  console.log(x.length)
  // const prisma: Prisma = new Prisma()
  let counter = 0
  /*
    couldn't this be replaced by

    counter = (await prisma.completion.findMany({ 
      where: {
        user_upstream_id: { in: x[i].map(y => y.user_id) },
        course_completionTocourse: { slug: "elements-of-ai" }
      }
    })).length

    ?
  */
  for (let i = 0; i < x.length; i++) {
    const existing = await prisma.completion.findMany({
      where: {
        user_upstream_id: x[i].user_id,
        course_completionTocourse: { slug: "elements-of-ai" },
      },
    })
    /*const exists = await prisma.$exists.completion({
      user_upstream_id: x[i].user_id,
      course: { slug: "elements-of-ai" },
    })*/
    if (existing.length > 0) counter++
  }
  console.log(counter)
  let y = data.filter(
    (p) =>
      p.namespace === "elements-of-ai" &&
      p.field_name == "language" &&
      p.value == "en",
  )
  let z = data
    .filter(
      (p) =>
        p.namespace === "elements-of-ai" &&
        p.field_name == "country" &&
        p.value == "Sweden",
    )
    .map((p) => p.user_id)
  counter = 0
  for (let i = 0; i < y.length; i++) {
    if (z.includes(y[i].user_id)) counter++
  }
  console.log(counter)
}

doIt().catch((e) => console.log(e))
