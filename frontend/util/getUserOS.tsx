function getUserOS() {
  var OSName = "OS"
  if (typeof window != "undefined") {
    if (window.navigator.appVersion.indexOf("Win") != -1) OSName = "Windows"
    if (window.navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS"
    if (window.navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX"
    if (window.navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux"
    return OSName
  } else {
    return OSName
  }
}

export default getUserOS
