import * as React from "react"
import Button from "@material-ui/core/Button"
import { signOut } from "../lib/authentication"
import LoginStateContext from "../contexes/LoginStateContext"
import UserDetailContext from "../contexes/UserDetailContext"
import { useApolloClient, useQuery } from "@apollo/react-hooks"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser as profileIcon } from "@fortawesome/free-solid-svg-icons"
import AdminIcon from "@material-ui/icons/AssignmentInd"
import styled from "styled-components"
import { gql } from "apollo-boost"
import { UserOverView } from "../static/types/generated/UserOverView"
import ErrorBoundary from "./ErrorBoundary"
import LanguageContext from "/contexes/LanguageContext"
import getCommonTranslator from "/translations/common"
import { useContext } from "react"

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
  const loggedIn = React.useContext(LoginStateContext)
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
      <React.Fragment>
        {loggedIn ? (
          <div>
            <StyledButton
              color="inherit"
              variant="text"
              onClick={() => signOut(client)}
            >
              {t("logout")}
            </StyledButton>
            <StyledButton color="inherit" variant="text" href="/profile">
              {isAdmin ? (
                <>
                  <AdminIcon style={{ marginRight: "0.2rem" }} /> Admin:{" "}
                </>
              ) : (
                <StyledIcon icon={profileIcon} />
              )}
              {userDisplayName}
            </StyledButton>
            {isAdmin ? (
              <StyledButton color="inherit" variant="text" href="/courses">
                Courses
              </StyledButton>
            ) : (
              ""
            )}
          </div>
        ) : (
          <>
            <StyledButton color="inherit" variant="text" href="/sign-in">
              {t("loginShort")}
            </StyledButton>
            <StyledButton color="inherit" variant="text" href="/sign-up">
              {t("signUp")}
            </StyledButton>
          </>
        )}
      </React.Fragment>
    </ErrorBoundary>
  )
}

export default MenuOptionButtons
