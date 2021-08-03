import getConfig from "next/config"
const { publicRuntimeConfig } = getConfig()

export const isProduction = process.env.NODE_ENV === "production"

export const BACKEND_URL = publicRuntimeConfig.NEXT_PUBLIC_BACKEND_URL
export const FRONTEND_URL = publicRuntimeConfig.NEXT_PUBLIC_FRONTEND_URL
export const DOMAIN = FRONTEND_URL?.replace(/(^https?:\/\/|:\d+)/g, "")
