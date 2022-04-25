import { useEffect } from "react"

import { useRouter } from "next/router"

export const useScrollToHash = () => {
  const router = useRouter()
  let scrollTimeouts: Array<NodeJS.Timeout> = []

  useEffect(() => {
    const onHashChange = (url: string) => {
      const hash = url.split("#")[1]

      if (!hash) {
        return
      }

      scrollTimeouts.forEach(clearTimeout)

      scrollTimeouts = [100, 500, 1000, 2000].map((ms) =>
        setTimeout(() => {
          try {
            document?.querySelector?.("#" + hash)?.scrollIntoView()
            scrollTimeouts.forEach(clearTimeout)
          } catch {}
        }, ms),
      )
    }

    router.events.on("hashChangeStart", onHashChange)
    return () => {
      scrollTimeouts.forEach(clearTimeout)
      router.events.off("hashChangeStart", onHashChange)
    }
  }, [router.asPath])
}
