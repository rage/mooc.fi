import { v4 as uuidv4 } from "uuid"

import { getAccessToken } from "/lib/authentication"

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

export async function updateAccount(firstName: string, lastName: string) {
  const accessToken = getAccessToken(undefined)

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

export async function updateUserDetails(fieldName: string, fieldValue: any) {
  const accessToken = getAccessToken(undefined)

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

  const userField = {
    first_name: existingUser.firstName,
    last_name: existingUser.lastName,
    organizational_id: existingUser.organizational_id,
  }

  let extraFields: { [key: string]: any } = {}
  extraFields[fieldName] = fieldValue

  const body = {
    user: {
      extra_fields: {
        namespace: "mooc.fi",
        data: extraFields,
      },
    },
    user_field: userField,
  }

  const newRes = await fetch(`${BASE_URL}/users/current`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return newRes.json()
}

export async function getJoinedOrganizations() {
  const accessToken = getAccessToken(undefined)

  const res = await fetch(
    `${BASE_URL}/users/current?show_user_fields=1&extra_fields=mooc.fi`,
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

  const joinedOrganizations = existingUser.extra_fields.joined_organizations

  return joinedOrganizations
}
