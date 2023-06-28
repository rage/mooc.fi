import { useEffect, useRef } from "react"

import { useConfirm } from "material-ui-confirm"
import Router, { useRouter } from "next/router"

import { useEventCallback } from "@mui/material/utils"

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
  const confirm = useConfirm()
  const { asPath } = useRouter()

  if (!texts) {
    texts = {}
  }
  texts.title ??= t("confirmationUnsavedChanges")
  texts.description ??= t("confirmationLeaveWithoutSaving")
  texts.confirmationText ??= t("confirmationYes")
  texts.cancellationText ??= t("confirmationNo")

  const bypassConfirmationRef = useRef(false)

  const stopNavigation = useEventCallback(() => {
    Router.events.emit("routeChangeError")
    throw "Abort route change due to unsaved changes; ignore this error" // NOSONAR
  })

  useEffect(() => {
    const shouldBypassConfirmation = () =>
      !enabled || bypassConfirmationRef.current
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (shouldBypassConfirmation()) return
      e.preventDefault()
      e.returnValue = texts?.description // will ignore this message, though
    }
    const handleBrowseAway = (url: string) => {
      if (shouldBypassConfirmation()) return
      if (url === asPath) return

      confirm(texts)
        .then(() => {
          Router.events.off("routeChangeStart", handleBrowseAway)
          Router.push(url)
        })
        .catch(() => {
          /* do nothing */
        })
      stopNavigation()
    }
    window.addEventListener("beforeunload", handleWindowClose)
    Router.events.on("routeChangeStart", handleBrowseAway)

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose)
      Router.events.off("routeChangeStart", handleBrowseAway)
    }
  }, [enabled, asPath, t, texts, confirm])

  return {
    bypassExitConfirmation(value = true) {
      bypassConfirmationRef.current = value
    },
  }
}

export default useExitConfirmation
