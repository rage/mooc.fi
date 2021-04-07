import { resetUserPassword } from "../services/tmc"

export function passwordReset() {
  return async (req: any, res: any) => {
    let email = req.body.email.trim()

    if (!email || email === "") {
      return res.status(400).json({
        success: false,
        message: "No email address provided",
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