import { resetUserPassword } from "../services/tmc"
import { ApiContext } from "."
import { User } from "@prisma/client"

export function passwordReset({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    let email = req.body.email.trim()

    if (!email || email === "") {
      return res.status(400).json({
        success: false,
        message: "No email address provided",
      })
    }

    let user = (
      await knex
        .select<any, User[]>("id", "email")
        .from("user")
        .where("email", email)
    )?.[0]

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        errors: "No such email address registered",
      })
    }

    const sendResetEmail = await resetUserPassword(email)

    if (sendResetEmail.success) {
      return res.status(200).json(sendResetEmail)
    } else {
      return res.status(404).json(sendResetEmail.response.data)
    }

    //Password resetting can be handled by TMC. If the password is updated via TMC, then the next time
    //the user signs in, their password on mooc.fi should be auto-updated as well
  }
}
