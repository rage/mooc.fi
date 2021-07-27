import getConfig from "next/config"
const { publicRuntimeConfig } = getConfig()

export const BACKEND_URL = publicRuntimeConfig.NEXT_PUBLIC_BACKEND_URL
export const FRONTEND_URL = publicRuntimeConfig.NEXT_PUBLIC_FRONTEND_URL
