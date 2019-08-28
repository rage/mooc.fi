import * as React from "react"
import Button from "@material-ui/core/Button"
import { signOut } from "/lib/authentication"
import LoginStateContext from "/contexes/LoginStateContext"
import UserDetailContext from "/contexes/UserDetailContext"
import { useApolloClient, useQuery } from "@apollo/react-hooks"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser as profileIcon } from "@fortawesome/free-solid-svg-icons"
import AdminIcon from "@material-ui/icons/AssignmentInd"
import styled from "styled-components"
import { gql } from "apollo-boost"
import { UserOverView } from "/static/types/generated/UserOverView"
import ErrorBoundary from "./ErrorBoundary"
import LanguageContext from "/contexes/LanguageContext"
import getCommonTranslator from "/translations/common"
import { useContext } from "react"
import LangLink from "/components/LangLink"

export const UserDetailQuery = gql`
  query UserOverView {
    currentUser {
      id
      first_name
      last_name
      email
    }
  }
`

const StyledIcon = styled(FontAwesomeIcon)`
  margin-right: 0.5rem;
  margin-bottom: 3px;
`

const StyledButton = styled(Button)`
  margin: 1rem;
  font-size: 18px;
`
const MenuOptionButtons = () => {
  const isAdmin = React.useContext(UserDetailContext)
  const lng = useContext(LanguageContext)
  const t = getCommonTranslator(lng.language)
  const client = useApolloClient()
  const { loading, error, data } = useQuery<UserOverView>(UserDetailQuery)

  if (error) {
    return (
      <div>
        Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
      </div>
    )
  }

  if (loading || !data) {
    return <div>Loading</div>
  }

  let userDisplayName: string = "Oma profiili"
  if (data.currentUser) {
    userDisplayName = `${data.currentUser.first_name} ${
      data.currentUser.last_name
    }`
  }

  return (
    <ErrorBoundary>
      <LoginStateContext.Consumer>
        {({ loggedIn, logInOrOut }) => (
          <React.Fragment>
            {loggedIn ? (
              <div>
                <StyledButton
                  color="inherit"
                  variant="text"
                  onClick={() => signOut(client).then(logInOrOut)}
                >
                  {t("logout")}
                </StyledButton>
                <LangLink href="/[lng]/profile" passHref>
                  <StyledButton color="inherit" variant="text">
                    {isAdmin ? (
                      <>
                        <AdminIcon style={{ marginRight: "0.2rem" }} /> Admin:{" "}
                      </>
                    ) : (
                      <StyledIcon icon={profileIcon} />
                    )}
                    {userDisplayName}
                  </StyledButton>
                </LangLink>
                {isAdmin ? (
                  <LangLink href="/[lng]/admin" passHref>
                    <StyledButton color="inherit" variant="text">
                      Admin panel
                    </StyledButton>
                  </LangLink>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <>
                <LangLink href="/[lng]/sign-in" passHref>
                  <StyledButton color="inherit" variant="text">
                    {t("loginShort")}
                  </StyledButton>
                </LangLink>
                <LangLink href="/[lng]/sign-up" passHref>
                  <StyledButton color="inherit" variant="text">
                    {t("signUp")}
                  </StyledButton>
                </LangLink>
              </>
            )}
          </React.Fragment>
        )}
      </LoginStateContext.Consumer>
    </ErrorBoundary>
  )
}

export default MenuOptionButtons
