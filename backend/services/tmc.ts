import axios from "axios";
import { UserInfo } from "../domain/UserInfo";

const BASE_URL = "https://tmc.mooc.fi";

export default class TmcClient {
  accessToken: String;
  constructor(accessToken: String) {
    this.accessToken = accessToken;
  }

  async getCurrentUserDetails(): Promise<UserInfo> {
    console.log("fetching...");
    const res = await axios.get(
      `${BASE_URL}/api/v8/users/current?show_user_fields=1&extra_fields=1`,
      {
        headers: { Authorization: this.accessToken }
      }
    );
    return res.data;
  }
}
