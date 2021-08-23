import React from "react"
import styled from "@emotion/styled"
import OrganizationButton from "/components/Buttons/OrganizationButton"

interface OrganizationButtonProps {
  hyVisible: boolean
  hyURL: string
  hakaURL: string
  hyCaption?: string
  hakaCaption?: string
}

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1em;
  row-gap: 0.5rem;
`

function OrganizationButtons({ hyVisible, hyURL, hakaURL, hyCaption, hakaCaption }: OrganizationButtonProps) {
  return (
    <ButtonContainer>
      {hyVisible && <OrganizationButton variant="hy" href={hyURL} caption={hyCaption} />}
      <OrganizationButton variant="haka" href={hakaURL} caption={hakaCaption} />
    </ButtonContainer>
  )
}

export default OrganizationButtons
