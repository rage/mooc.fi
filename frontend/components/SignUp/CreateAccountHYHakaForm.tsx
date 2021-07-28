import styled from "@emotion/styled"
import Link from "next/link"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useLanguageContext } from "/contexts/LanguageContext"
import { faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@material-ui/core"

const isProduction = process.env.NODE_ENV === "production"

const StyledForm = styled.section`
  padding: 1em;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  button:not(:last-child) {
    margin-right: 0.5rem;
  }
`

const CreateAccountHYHakaForm = () => {
  const { language } = useLanguageContext()

  const HY_REGISTER_URL = isProduction
    ? `/sign-up/hy?language=${language}`
    : `http://localhost:5000/sign-up/hy?language=${language}`
  const HAKA_REGISTER_URL = isProduction
    ? `/sign-up/haka?language=${language}`
    : `http://localhost:5000/sign-up/haka?language=${language}`

  return (
    <StyledForm>
      <ButtonContainer>
        <Link href={HY_REGISTER_URL}>
          <Button
            color="primary"
            startIcon={<FontAwesomeIcon icon={faUserPlus} />}
          >
            Register with HY
          </Button>
        </Link>
        <Link href={HAKA_REGISTER_URL}>
          <Button
            color="primary"
            startIcon={<FontAwesomeIcon icon={faUserPlus} />}
          >
            Register with Haka
          </Button>
        </Link>
      </ButtonContainer>
    </StyledForm>
  )
}

export default CreateAccountHYHakaForm
