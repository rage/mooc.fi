import React from "react"

import OrganizationButton from "/components/Buttons/OrganizationButton"

import styled from "@emotion/styled"
import { Alert, Paper } from "@mui/material"

interface OrganizationButtonProps {
  hyVisible?: boolean
  hakaVisible?: boolean
  hyURL: string
  hakaURL: string
  hyCaption?: string
  hakaCaption?: string
  error?: string
}

const ButtonContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em;
  row-gap: 0.5rem;
  margin-bottom: 1rem;
`

function OrganizationButtons({
  hyVisible = true,
  hakaVisible = true,
  hyURL,
  hakaURL,
  hyCaption,
  hakaCaption,
  error,
}: OrganizationButtonProps) {
  if (!hakaVisible && !hyVisible) {
    return null
  }

  return (
    <ButtonContainer>
      {error && <Alert severity="error">{error}</Alert>}
      {hyVisible && (
        <OrganizationButton variant="hy" href={hyURL} caption={hyCaption} />
      )}
      {hakaVisible && (
        <OrganizationButton
          variant="haka"
          href={hakaURL}
          caption={hakaCaption}
        />
      )}
    </ButtonContainer>
  )
}

export default OrganizationButtons
