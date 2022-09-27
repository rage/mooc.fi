import axios from "axios"

import { CERTIFICATES_URL } from "../config"

export const checkCertificate = async (slug: string, accessToken: string) => {
  const res = await axios.get(
    `${CERTIFICATES_URL}/certificate-availability/${slug}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return res?.data
}

export const checkCertificateForUser = async (
  slug: string,
  upstream_id: number,
  accessToken: string,
) => {
  const res = await axios.get(
    `${CERTIFICATES_URL}/admin/certificate-availability/${slug}/${upstream_id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return res?.data
}

export const createCertificate = async (slug: string, accessToken: string) => {
  try {
    const res = await axios.post(
      `${CERTIFICATES_URL}/create/${slug}`,
      undefined,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return res?.data
  } catch (e) {
    console.log(e)
    return null
  }
}

// TODO: create certificate for user, needs an endpoint in certificates as well
