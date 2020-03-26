import uuidv4 from "uuid/v4"
const BASE_URL = "https://tmc.mooc.fi/api/v8"
export function createAccount(data: any) {
  data.username = uuidv4()
  const body = {
    user: data,
    user_field: {
      first_name: data.first_name,
      last_name: data.last_name,
    },
    origin: "mooc.fi",
    language: "fi",
  }
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/users`, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((json) => {
        if (!json.success) {
          reject(json.errors)
        } else {
          resolve(json)
        }
      })
    })
  })
}
