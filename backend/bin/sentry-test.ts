import sentryLogger from "./lib/logger"
import { ValidationError } from "./lib/errors"

const logger = sentryLogger({ service: "sentry-test" })

const test = async () => {
  let i = 1

  while (i-- > 0) {
    //if (Math.random() > 0.5) {
    logger.error(new ValidationError(`should be logged`, { random: i }))
    //} else {
    logger.info("alright", { message: "yes" })
    //}
  }
}

test()
