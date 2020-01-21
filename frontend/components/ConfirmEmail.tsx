import React from "react"
import styled from "styled-components"
import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"
import getSignUpTranslator from "/translations/sign-up"

const InfoBox = styled.div`
  margin-bottom: 2rem;
`

const FormContainer = styled.div`
  height: 100%;
  margin-top: 2rem;
`

export interface ConfirmEmailProps {
  onComplete: Function
}

// @ts-ignore: onComplete function not used at the moment
const ConfirmEmail = (props: ConfirmEmailProps) => {
  const { language } = useContext(LanguageContext)
  const t = getSignUpTranslator(language)

  return (
    <FormContainer>
      <h1>{t("confirmEmailTitle")}</h1>
      <InfoBox>
        <p>{t("confirmEmailInfo")}</p>
      </InfoBox>
    </FormContainer>
  )
}

export default ConfirmEmail
