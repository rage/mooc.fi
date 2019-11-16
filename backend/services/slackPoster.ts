import axios from "axios"

export default class SlackPoster {
  accessToken: String | null

  constructor(accessToken: String | null = null) {
    this.accessToken = accessToken
  }

  async post(url: string, data: any) {
    const res = await axios.post(url, data).catch(err => {
      if (err) console.log(err)
    })
  }
}
