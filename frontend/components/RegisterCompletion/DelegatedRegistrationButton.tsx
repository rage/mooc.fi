import { useState } from "react"

import fetch from "isomorphic-unfetch"

import { Alert } from "@mui/material"

import { CallToActionButton, InstructionsSection, Prose } from "./styles"
import { useTranslator } from "/hooks/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"
import { getCookie } from "/util/cookie"

interface DelegatedRegistrationButtonProps {
  handoffUrl: string
}

/** Sends the student to courses.mooc.fi to register their credits. */
function DelegatedRegistrationButton({
  handoffUrl,
}: DelegatedRegistrationButtonProps) {
  const t = useTranslator(RegisterCompletionTranslations)
  const [status, setStatus] = useState<"idle" | "opening" | "failed">("idle")

  const openCoursesMoocFi = async () => {
    setStatus("opening")
    try {
      const res = await fetch(handoffUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${getCookie("access_token")}` },
      })
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

  return (
    <InstructionsSection>
      <Prose>{t("delegatedRegistrationBody")}</Prose>
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
      {status === "failed" && (
        <Alert severity="error">{t("delegatedRegistrationError")}</Alert>
      )}
    </InstructionsSection>
  )
}

export default DelegatedRegistrationButton
