import TmcClient from "../../../services/tmc"
import { PrismaClient } from "@prisma/client"

const getUserFromTMCAndCreate = async (
  prisma: PrismaClient,
  user_id: number,
) => {
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
      password: "password",
    },
  })
}

export default getUserFromTMCAndCreate
