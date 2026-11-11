import fetch from "isomorphic-unfetch"

import { getAccessToken } from "./authentication"

export const CERTIFICATES_URL = "https://certificates.mooc.fi"

export const checkCertificate = async (courseSlug: string) => {
  const accessToken = getAccessToken(undefined)

  const res = await fetch(
    `${CERTIFICATES_URL}/certificate-availability/${courseSlug}`,
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

  const res = await fetch(`${CERTIFICATES_URL}/create/${courseSlug}`, {
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
}
