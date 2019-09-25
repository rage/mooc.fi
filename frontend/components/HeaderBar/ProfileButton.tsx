import * as React from "react"
import { gql } from "apollo-boost"
import { UserOverView } from "/static/types/generated/UserOverView"
import { useQuery } from "@apollo/react-hooks"
import styled from "styled-components"
import LangLink from "/components/LangLink"
import Button from "@material-ui/core/Button"
import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"

const StyledButton = styled(Button)`
  margin: 1rem;
  font-size: 22px;
`

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
const ProfileButton = () => {
  const { loading, error, data } = useQuery<UserOverView>(UserDetailQuery)
  const { language } = useContext(LanguageContext)
  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !data) {
    return <p>Error</p>
  }
  let userDisplayName: string = "Oma profiili"
  if (data.currentUser) {
    userDisplayName = `${data.currentUser.first_name} ${
      data.currentUser.last_name
    }`
  }
  return (
    <LangLink href="/[lng]/profile" as={`/${language}/profile`}>
      <StyledButton color="inherit" variant="text">
        {userDisplayName}
      </StyledButton>
    </LangLink>
  )
}

export default ProfileButton
