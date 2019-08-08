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
class ConfirmEmail extends React.Component<ConfrimEmailProps> {
  onClick = async (e: any) => {
    e.preventDefault()
  }

  state = {
    email: undefined,
    password: undefined,
    submitting: false,
    error: false,
  }

  render() {
    return (
      <FormContainer>
        <h1>Mooc.fi käyttäjätunnuksesi on luotu</h1>
        <InfoBox>
          <p>
            Olemme lähettäneet sähköpostiisi sähköpostiosoitteen
            varmistuslinkin. Käy nyt sähköpostissasi ja varmista osoitteesi.
          </p>
        </InfoBox>
      </FormContainer>
    )
  }
}

export default ConfirmEmail
