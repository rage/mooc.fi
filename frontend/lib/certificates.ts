import fetch from "isomorphic-unfetch"

import { getAccessToken } from "./authentication"

const SERVICE_URL = "https://certificates.mooc.fi"

export const checkCertificate = async (courseSlug: string) => {
  const accessToken = getAccessToken(undefined)

  const res = await fetch(
    `${SERVICE_URL}/certificate-availability/${courseSlug}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (res.ok) {
    return res.json()
  }
}

export const createCertificate = async (courseSlug: string) => {
  const accessToken = getAccessToken(undefined)

  try {
    const res = await fetch(`${SERVICE_URL}/create/${courseSlug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (res.ok) {
      return res.json()
    }
    const e = await res.json()
    console.log(e)
    return null
  } catch (e) {
    console.log(e)
    return null
  }
}
