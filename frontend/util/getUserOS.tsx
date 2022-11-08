import { GetServerSidePropsContext } from "next"

export type UserOSType = "OS" | "Linux" | "Windows" | "macOS" | "ZIP"

function getUserOS(req?: GetServerSidePropsContext["req"]): UserOSType {
  let OSName: UserOSType = "OS"
  const detectString =
    req?.headers["user-agent"] ?? typeof window !== "undefined"
      ? window.navigator.appVersion
      : ""
  if (detectString.indexOf("Win") != -1) OSName = "Windows"
  if (detectString.indexOf("Mac") != -1) OSName = "macOS"
  if (detectString.indexOf("Linux") != -1) OSName = "Linux"
  if (detectString.indexOf("X11") != -1) OSName = "Linux"

  return OSName
}

export default getUserOS
