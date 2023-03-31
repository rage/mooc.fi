import { useCallback, useEffect, useRef } from "react"

import { useConfirm } from "material-ui-confirm"
import { useRouter } from "next/router"

import { useTranslator } from "./useTranslator"
import CommonTranslations from "/translations/common"

interface UseExitConfirmationArgs {
  texts?: {
    title?: string
    description?: string
    confirmationText?: string
    cancellationText?: string
  }
  enabled?: boolean
}

// adapted from https://github.com/vercel/next.js/discussions/32231
function useExitConfirmation({ texts, enabled }: UseExitConfirmationArgs = {}) {
  const t = useTranslator(CommonTranslations)
  const {
    title = t("confirmationUnsavedChanges"),
    description = t("confirmationLeaveWithoutSaving"),
    confirmationText = t("confirmationYes"),
    cancellationText = t("confirmationNo"),
  } = texts ?? {}
  const confirm = useConfirm()

  const router = useRouter()
  const bypassConfirmationRef = useRef(false)

  const stopNavigation = useCallback(() => {
    router.events.emit("routeChangeError")
    throw "Abort route change due to unsaved changes; ignore this error" // NOSONAR
  }, [router.events])

  useEffect(() => {
    const shouldByPassconfimation = () =>
      !enabled || bypassConfirmationRef.current
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (shouldByPassconfimation()) return
      e.preventDefault()
      e.returnValue = description // will ignore this message, though
    }
    const handleBrowseAway = (url: string) => {
      if (shouldByPassconfimation()) return
      if (url === router.asPath) return

      confirm({
        title,
        description,
        confirmationText,
        cancellationText,
      })
        .then(() => {
          router.events.off("routeChangeStart", handleBrowseAway)
          router.push(url)
        })
        .catch(() => {
          /* do nothing */
        })
      stopNavigation()
    }
    window.addEventListener("beforeunload", handleWindowClose)
    router.events.on("routeChangeStart", handleBrowseAway)

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose)
      router.events.off("routeChangeStart", handleBrowseAway)
    }
  }, [
    enabled,
    router.events,
    t,
    title,
    description,
    confirmationText,
    cancellationText,
    confirm,
  ])

  return {
    bypassExitConfirmation(value = true) {
      bypassConfirmationRef.current = value
    },
  }
}

export default useExitConfirmation
