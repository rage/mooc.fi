import { useEffect } from "react"

import { useRouter } from "next/router"

import { initGA, logPageView } from "/lib/gtag"

export function useLogPageView() {
  const router = useRouter()

  useEffect(() => {
    initGA()
    logPageView()

    router.events.on("routeChangeComplete", logPageView)

    return () => {
      router.events.off("routeChangeComplete", logPageView)
    }
  }, [router])
}
