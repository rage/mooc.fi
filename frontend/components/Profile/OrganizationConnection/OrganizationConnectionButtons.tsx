import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLink } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import { Button } from "@material-ui/core"
import { useLanguageContext } from "/contexts/LanguageContext"
import styled from "@emotion/styled"

const isProduction = process.env.NODE_ENV === "production"

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
    ? `https://mooc.fi/connect/hy?language=${language}`
    : `http://localhost:5000/hy?language=${language}`
  const HAKA_CONNECT_URL = isProduction
    ? `https://mooc.fi/connect/haka?language=${language}`
    : `http://localhost:5000/haka?language=${language}`

  return (
    <ButtonContainer>
      {hyVisible && (
        <Link href={HY_CONNECT_URL}>
          <Button color="primary" startIcon={<FontAwesomeIcon icon={faLink} />}>
            Connect to HY
          </Button>
        </Link>
      )}
      <Link href={HAKA_CONNECT_URL}>
        <Button color="secondary" startIcon={<FontAwesomeIcon icon={faLink} />}>
          Connect to another organization
        </Button>
      </Link>
    </ButtonContainer>
  )
}

export default ConnectionButtons
