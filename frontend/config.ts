import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

export const isProduction = process.env.NODE_ENV === "production"

export const BACKEND_URL = publicRuntimeConfig.NEXT_PUBLIC_BACKEND_URL
export const FRONTEND_URL = publicRuntimeConfig.NEXT_PUBLIC_FRONTEND_URL
export const DOMAIN = FRONTEND_URL?.replace(/(^https?:\/\/|:\d+)/g, "")
export const LOGOUT_URL = isProduction
  ? `${FRONTEND_URL}/Shibboleth.sso/Logout?return=`
  : ""
export const TMC_HOST =
  publicRuntimeConfig.NEXT_PUBLIC_TMC_HOST || "https://tmc.mooc.fi"
