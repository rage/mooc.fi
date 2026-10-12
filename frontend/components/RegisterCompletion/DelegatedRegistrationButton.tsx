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

/**
 * Sends the student to courses.mooc.fi, which registers the credits of completions dated on or
 * after the course's `credit_registration_delegated_at`.
 */
function DelegatedRegistrationButton({
  handoffUrl,
}: DelegatedRegistrationButtonProps) {
  const t = useTranslator(RegisterCompletionTranslations)
  const [isOpening, setIsOpening] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)

  const openCoursesMoocFi = async () => {
    setIsOpening(true)
    setHasFailed(false)
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
      setIsOpening(false)
      setHasFailed(true)
    }
  }

  return (
    <InstructionsSection>
      <Prose>{t("delegatedRegistrationBody")}</Prose>
      <CallToActionButton
        variant="contained"
        color="primary"
        size="medium"
        disabled={isOpening}
        onClick={openCoursesMoocFi}
      >
        {isOpening
          ? t("delegatedRegistrationOpening")
          : t("delegatedRegistrationButton")}
      </CallToActionButton>
      {hasFailed && (
        <Alert severity="error">{t("delegatedRegistrationError")}</Alert>
      )}
    </InstructionsSection>
  )
}

export default DelegatedRegistrationButton
