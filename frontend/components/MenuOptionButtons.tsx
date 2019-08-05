import * as React from "react"
import Button from "@material-ui/core/Button"
import { signOut } from "../lib/authentication"
import LoginStateContext from "../contexes/LoginStateContext"
import { useApolloClient } from "react-apollo-hooks"
import NextI18Next from "../i18n"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser as profileIcon } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"

const StyledIcon = styled(FontAwesomeIcon)`
  margin-right: 0.5rem;
`

const MenuOptionButtons = () => {
  const loggedIn = React.useContext(LoginStateContext)
  const client = useApolloClient()
  return (
    <React.Fragment>
      {loggedIn ? (
        <div>
          <Button
            color="inherit"
            variant="text"
            onClick={() => signOut(client)}
          >
            <NextI18Next.Trans i18nKey="common:logout" />
          </Button>
          <Button color="inherit" variant="text" href="/profile">
            <StyledIcon icon={profileIcon} />
            <NextI18Next.Trans i18nKey="common:profile" />
          </Button>
        </div>
      ) : (
        <Button color="inherit" variant="text" href="/sign-in">
          <NextI18Next.Trans i18nKey="common:loginShort" />
        </Button>
      )}
    </React.Fragment>
  )
}

export default MenuOptionButtons
