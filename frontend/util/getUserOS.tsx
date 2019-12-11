export type userOsType = "OS" | "Linux" | "Windows" | "macOS" | "ZIP"

function getUserOS(): userOsType {
  var OSName: userOsType = "OS"
  if (typeof window != "undefined") {
    if (window.navigator.appVersion.indexOf("Win") != -1) OSName = "Windows"
    if (window.navigator.appVersion.indexOf("Mac") != -1) OSName = "macOS"
    if (window.navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux"
    return OSName
  } else {
    return OSName
  }
}

export default getUserOS
