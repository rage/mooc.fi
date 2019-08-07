import React from "react"

import styled from "styled-components"

const InfoBox = styled.div`
  margin-bottom: 2rem;
`

const FormContainer = styled.div`
  height: 100%;
  margin-top: 2rem;
`

export interface ConfrimEmailProps {
  onComplete: Function
  t: Function
}
const ConfirmEmail = (props: ConfrimEmailProps) => {
  const { t } = props
  const onClick = async (e: any) => {
    e.preventDefault()
  }

  const state = {
    email: undefined,
    password: undefined,
    submitting: false,
    error: false,
  }

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
