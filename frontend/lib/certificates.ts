import axios from "axios"
import { getAccessToken } from "./authentication"

const SERVICE_URL = "https://certificates.mooc.fi"

export const checkCertificate = async (courseSlug: string) => {
  const accessToken = await getAccessToken(undefined)

  const res = await axios.get(
    `${SERVICE_URL}/certificate-availability/${courseSlug}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return res?.data
}

export const createCertificate = async (courseSlug: string) => {
  const accessToken = await getAccessToken(undefined)

  try {
    const res = await axios.post(
      `${SERVICE_URL}/create/${courseSlug}`,
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
