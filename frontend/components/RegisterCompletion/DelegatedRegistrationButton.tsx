import { ReactNode, useEffect, useState } from "react"

import fetch from "isomorphic-unfetch"
import { useRouter } from "next/router"

import { useApolloClient } from "@apollo/client"
import { Alert, Button, Link } from "@mui/material"

import { CallToActionButton, InstructionsSection, Prose } from "./styles"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import { signOut } from "/lib/authentication"
import RegisterCompletionTranslations from "/translations/register-completion"
import { getCookie } from "/util/cookie"

const COURSES_BASE_URL =
  process.env.NEXT_PUBLIC_COURSES_BASE_URL ?? "https://courses.mooc.fi"

type Status = "idle" | "opening" | "signedOut" | "rateLimited" | "failed"

interface DelegatedRegistrationButtonProps {
  handoffUrl: string
  /** The course whose completions courses.mooc.fi registers, for the plain fallback link. */
  handlerCourseId: string
  description?: ReactNode
}

/** Sends the student to courses.mooc.fi to register their credits. */
function DelegatedRegistrationButton({
  handoffUrl,
  handlerCourseId,
  description,
}: DelegatedRegistrationButtonProps) {
  const t = useTranslator(RegisterCompletionTranslations)
  const { locale } = useRouter()
  const apollo = useApolloClient()
  const { logInOrOut } = useLoginStateContext()
  const [status, setStatus] = useState<Status>("idle")

  // Back from courses.mooc.fi, the browser may restore this page as it was left: still opening.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setStatus("idle")
      }
    }
    window.addEventListener("pageshow", onPageShow)
    return () => window.removeEventListener("pageshow", onPageShow)
  }, [])

  const openCoursesMoocFi = async () => {
    setStatus("opening")
    try {
      const res = await fetch(handoffUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ui_language: locale }),
      })
      if (res.status === 401) {
        setStatus("signedOut")
        return
      }
      if (res.status === 429) {
        setStatus("rateLimited")
        return
      }
      if (!res.ok) {
        throw new Error(`Handoff failed with ${res.status}`)
      }
      const { redirect_url } = await res.json()
      // The URL expires within seconds, so navigate at once.
      window.location.assign(redirect_url)
    } catch {
      setStatus("failed")
    }
  }

  // Pages with this button are signed-in only: signing out sends the student to sign in and back.
  const signInAgain = () => signOut(apollo, logInOrOut)

  return (
    <InstructionsSection>
      <Prose>{description ?? t("delegatedRegistrationBody")}</Prose>
      <CallToActionButton
        variant="contained"
        color="primary"
        size="medium"
        disabled={status === "opening"}
        onClick={openCoursesMoocFi}
      >
        {status === "opening"
          ? t("delegatedRegistrationOpening")
          : t("delegatedRegistrationButton")}
      </CallToActionButton>
      <div aria-live="polite">
        {status === "signedOut" && (
          <Alert
            severity="warning"
            action={
              <Button color="inherit" size="small" onClick={signInAgain}>
                {t("delegatedRegistrationSignInAgain")}
              </Button>
            }
          >
            {t("delegatedRegistrationSignedOut")}
          </Alert>
        )}
        {status === "rateLimited" && (
          <Alert severity="warning">
            {t("delegatedRegistrationRateLimited")}
          </Alert>
        )}
        {status === "failed" && (
          <Alert severity="error">
            {t("delegatedRegistrationError")}{" "}
            <Link
              href={`${COURSES_BASE_URL}/completion-registration/mooc-fi/${handlerCourseId}`}
            >
              {t("delegatedRegistrationFallbackLink")}
            </Link>
          </Alert>
        )}
      </div>
    </InstructionsSection>
  )
}

export default DelegatedRegistrationButton
