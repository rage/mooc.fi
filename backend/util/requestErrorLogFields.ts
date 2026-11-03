import axios from "axios"

/**
 * What to log of a failed outgoing request: an axios error whole carries its request,
 * Authorization and form secrets included.
 */
export const requestErrorLogFields = (error: unknown) =>
  axios.isAxiosError(error)
    ? { status: error.response?.status, code: error.code }
    : { status: undefined, code: undefined }
