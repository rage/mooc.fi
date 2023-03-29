import { useEffect } from "react"

import Router from "next/router"

let scrollTimeouts: Array<NodeJS.Timeout> = []

const onHashChange = (url: string) => {
  const hash = url.split("#")[1]

  if (!hash) {
    return
  }

  scrollTimeouts.forEach(clearTimeout)

  scrollTimeouts = [100, 500, 1000, 2000].map((ms) =>
    setTimeout(() => {
      try {
        document
          ?.querySelector?.("#" + hash)
          ?.scrollIntoView({ block: "start" })
        scrollTimeouts.forEach(clearTimeout)
      } catch {}
    }, ms),
  )
}

const onWindowHashChange = () => onHashChange(window?.location.href)

export const useScrollToHash = () => {
  useEffect(() => {
    Router.events.on("hashChangeStart", onHashChange)
    window?.addEventListener("hashChange", onWindowHashChange)
    window?.addEventListener("load", onWindowHashChange)

    return () => {
      scrollTimeouts.forEach(clearTimeout)
      Router.events.off("hashChangeStart", onHashChange)
      window?.removeEventListener("hashChange", onWindowHashChange)
      window?.removeEventListener("load", onWindowHashChange)
    }
  }, [])
}
