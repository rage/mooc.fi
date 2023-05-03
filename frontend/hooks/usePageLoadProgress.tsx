import { useCallback, useEffect, useState } from "react"

import { Router } from "next/router"

interface UsePageLoadProgressArgs {
  startDelay?: number
  takingLongDelay?: number
  cancelDelay?: number
}

let timeouts: Array<NodeJS.Timeout> = []

function usePageLoadProgress(props: UsePageLoadProgressArgs = {}) {
  const { startDelay = 300, takingLongDelay = 3000, cancelDelay = 5000 } = props
  const [loading, setLoading] = useState(false)
  const [loadingTakingLong, setLoadingTakingLong] = useState(false)

  const handleRouteChangeStart = useCallback(() => {
    timeouts.push(
      setTimeout(() => {
        setLoading(true)

        timeouts.push(
          setTimeout(() => {
            setLoadingTakingLong(true)
          }, takingLongDelay),
        )

        timeouts.push(
          setTimeout(() => {
            setLoading(false)
            setLoadingTakingLong(false)
          }, cancelDelay),
        )
      }, startDelay),
    )
  }, [])

  const handleRouteChangeComplete = useCallback(() => {
    const clearedTimeouts: Array<NodeJS.Timeout> = []

    timeouts.forEach((timeout) => {
      clearedTimeouts.push(timeout)
      clearTimeout(timeout)
    })
    timeouts = timeouts.filter((t) => !clearedTimeouts.includes(t))

    setLoading(false)
    setLoadingTakingLong(false)
  }, [])

  useEffect(() => {
    Router.events.on("routeChangeStart", handleRouteChangeStart)
    Router.events.on("routeChangeError", handleRouteChangeComplete)
    Router.events.on("routeChangeComplete", handleRouteChangeComplete)

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
      Router.events.off("routeChangeStart", handleRouteChangeStart)
      Router.events.off("routeChangeError", handleRouteChangeComplete)
      Router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [])

  return { loading, loadingTakingLong }
}

export default usePageLoadProgress
