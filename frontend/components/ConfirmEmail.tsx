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
}
//@ts-ignore
const ConfirmEmail = (props: ConfrimEmailProps) => {
  return (
    <FormContainer>
      <h1>"confirmEmailTitle"</h1>
      <InfoBox>
        <p>"confirmEmailInfo"</p>
      </InfoBox>
    </FormContainer>
  )
}

export default ConfirmEmail
