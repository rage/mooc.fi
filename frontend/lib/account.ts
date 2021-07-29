//import { v4 as uuidv4 } from "uuid"
import { getAccessToken } from "/lib/authentication"
import { createUser } from "../packages/moocfi-auth"

const BASE_URL = "https://tmc.mooc.fi/api/v8"

export async function createAccount(data: any) {
  return await createUser({
    email: data.email,
    password: data.password,
    confirmPassword: data.password_confirmation,
    extra_fields: {},
    user_fields: {
      first_name: data.first_name,
      last_name: data.last_name,
    },
    origin: "mooc.fi",
    provider: "native",
    language: "fi",
    domain: "mooc.fi",
    priority: "tmc",
  })
}

/*
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
*/

export async function updateAccount(firstName: string, lastName: string) {
  const accessToken = await getAccessToken(undefined)

  if (!accessToken) {
    throw new Error("not logged in?")
  }

  const res = await fetch(
    `${BASE_URL}/users/current?show_user_fields=1&extra_fields=1`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error("error fetching existing user")
  }

  const existingUser = await res.json()

  const newUser = {
    ...existingUser,
    user_field: {
      ...existingUser.user_field,
      first_name: firstName,
      last_name: lastName,
    },
  }

  const newRes = await fetch(`${BASE_URL}/users/${existingUser.id}`, {
    method: "PUT",
    body: JSON.stringify(newUser),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return await newRes.json()
}
