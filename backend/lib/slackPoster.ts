import axios from "axios"
import * as winston from "winston"

import { SlackPosterError } from "./errors"

export default class SlackPoster {
  // @ts-ignore: not used for now
  accessToken: string | null

  constructor(readonly logger: winston.Logger) {}

  async post(url: string, data: any) {
    this.logger.info("posting to Slack...")
    const res = await axios.post(url, data).catch((err) => {
      if (err) {
        this.logger.error(new SlackPosterError("Error posting to Slack", err))
      }
    })

    return res
  }
}
