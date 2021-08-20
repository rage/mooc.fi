import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLink } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import { Button } from "@material-ui/core"
import { useLanguageContext } from "/contexts/LanguageContext"
import styled from "@emotion/styled"
import { isProduction } from "/config"
import OrganizationButton from "/components/Buttons/OrganizationButton"

interface ConnectButtonProps {
  hyVisible: boolean
}

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  button:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`
function ConnectionButtons({ hyVisible }: ConnectButtonProps) {
  const { language } = useLanguageContext()

  const HY_CONNECT_URL = isProduction
    ? `/connect/hy?language=${language}`
    : `http://localhost:5000/connect/hy?language=${language}`
  const HAKA_CONNECT_URL = isProduction
    ? `/connect/haka?language=${language}`
    : `http://localhost:5000/connect/haka?language=${language}`

  return (
    <ButtonContainer>
      {hyVisible && <OrganizationButton variant="hy" href={HY_CONNECT_URL} />}
      <OrganizationButton variant="haka" href={HAKA_CONNECT_URL} />
    </ButtonContainer>
  )
}

export default ConnectionButtons
