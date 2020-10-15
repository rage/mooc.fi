import TmcClient from "../../../services/tmc"
import { PrismaClient, User } from "@prisma/client"
import sleep from "sleep-promise"
import { UserInfo } from "/domain/UserInfo"
import Knex from "../../../util/knex"

const getUserFromTMC = async (prisma: PrismaClient, user_id: number) => {
  const tmc: TmcClient = new TmcClient()
  const userDetails = await tmc.getUserDetailsById(user_id)

  return prisma.user.create({
    data: {
      upstream_id: userDetails.id,
      first_name: userDetails.user_field.first_name,
      last_name: userDetails.user_field.last_name,
      email: userDetails.email,
      username: userDetails.username,
      administrator: userDetails.administrator,
    },
  })
}

export const getBatchUsersFromTMC = async (
  userIds: number[],
): Promise<User[]> => {
  const tmc: TmcClient = new TmcClient()
  let userDetails: UserInfo[] | null = null
  try {
    userDetails = await tmc.getBatchUserDetailsById(userIds)
  } catch (e) {
    await sleep(5000)
    userDetails = await tmc.getBatchUserDetailsById(userIds)
  }

  if (!userDetails) {
    throw new Error("Getting user details failed")
  }

  const res: any[] = []

  // TODO: Could be more efficient here if used a single sql query
  // But must handle conflicts with ON CONFLICT
  for (const o of userDetails) {
    try {
      const newUser = await Knex("user")
        .insert({
          upstream_id: o.id,
          first_name: o.user_field?.first_name,
          last_name: o.user_field?.last_name,
          email: o.email,
          username: o.username,
          administrator: o.administrator,
        })
        .returning("*")
      res.push(newUser[0])
    } catch (e) {
      const user = (await Knex("user").where("upstream_id", o.id).limit(1))[0]
      res.push(user)
      if (!user) {
        throw e
      }
    }
  }

  return res
}

export default getUserFromTMC
