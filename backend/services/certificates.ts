import axios from "axios"

const BASE_URL = "https://certificates.mooc.fi"

export const checkCertificate = async (
  courseId: string,
  accessToken: string,
) => {
  const res = await axios.get(
    `${BASE_URL}/certificate-availability/${courseId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return res?.data
}

export const createCertificate = async (
  courseId: string,
  accessToken: string,
) => {
  try {
    const res = await axios.post(`${BASE_URL}/create/${courseId}`, undefined, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return res?.data
  } catch (e) {
    console.log(e)
    return null
  }
}
