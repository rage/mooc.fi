import React from "react"

import OrganizationButton from "/components/Buttons/OrganizationButton"

import styled from "@emotion/styled"
import { Paper } from "@material-ui/core"

interface OrganizationButtonProps {
  hyVisible?: boolean
  hakaVisible?: boolean
  hyURL: string
  hakaURL: string
  hyCaption?: string
  hakaCaption?: string
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
}: OrganizationButtonProps) {
  return (
    <ButtonContainer>
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
