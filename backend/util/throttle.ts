import { ApiContext } from "../auth"
const RATE_LIMIT = 50

export async function throttle(user: any, { knex }: ApiContext) {
  let throttleData = {
    status: 200,
    success: true,
    message: "",
  }

  let passwordThrottle =
    user.password_throttle || <any>[{ currentRate: 0, limitStamp: null }]

  passwordThrottle.forEach((t: any) => {
    t.currentRate++
    if (t.currentRate >= RATE_LIMIT && t.limitStamp) {
      let renewStamp = <any>new Date().getDate()
      let diffTime = Math.ceil(
        Math.abs(renewStamp - new Date(t.limitStamp).getDate()) /
          (1000 * 60 * 60 * 24),
      )

      if (diffTime >= 1) {
        t.currentRate = 1
      } else {
        throttleData = {
          status: 403,
          success: false,
          message:
            "You have made too many sign in attempts. Please try again in 24 hours.",
        }
        return
      }
    }

    t.limitStamp = new Date()

    throttleData = {
      status: 403,
      success: false,
      message: `Incorrect password. You have ${
        RATE_LIMIT - t.currentRate
      } attempts left.`,
    }
    return
  })

  await knex("user")
    .update({ password_throttle: JSON.stringify(passwordThrottle) })
    .where("email", user.email)

  return throttleData
}
