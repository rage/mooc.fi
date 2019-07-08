import axios from "axios"

export default class SlackPoster {
  accessToken: String
  constructor(accessToken: String = null) {
    this.accessToken = accessToken
  }

  async post(url: string, data: JSON) {
    const res = await axios.post(url, data).catch(err => {
      if (err) console.log(err)
    })
  }
}
