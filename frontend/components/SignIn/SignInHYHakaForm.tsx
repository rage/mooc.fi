import styled from "@emotion/styled"
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@material-ui/core"
import Link from "next/link"
import React from "react"
import { useLanguageContext } from "/contexts/LanguageContext"

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

function SignInHYHaka() {
  const { language } = useLanguageContext()

  const HY_LOGIN_URL = isProduction
    ? `/sign-in/hy?language=${language}`
    : `http://localhost:5000/sign-in/hy?language=${language}`
  const HAKA_LOGIN_URL = isProduction
    ? `/sign-in/haka?language=${language}`
    : `http://localhost:5000/sign-in/haka?language=${language}`

  return (
    <StyledForm>
      <ButtonContainer>
        <Link href={HY_LOGIN_URL}>
          <Button
            color="primary"
            startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
          >
            Login with HY
          </Button>
        </Link>
        <Link href={HAKA_LOGIN_URL}>
          <Button
            color="primary"
            startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
          >
            Login with Haka
          </Button>
        </Link>
      </ButtonContainer>
    </StyledForm>
  )
}

export default SignInHYHaka
