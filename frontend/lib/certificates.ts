import axios from "axios"
import { getAccessToken } from "./authentication"

const SERVICE_URL = "https://certificates.mooc.fi"

export const checkCertificateAvailability = async (courseSlug: string) => {
  const accessToken = getAccessToken(undefined)

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
