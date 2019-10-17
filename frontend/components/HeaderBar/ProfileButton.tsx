import * as React from "react"
import { gql } from "apollo-boost"
import { UserOverView } from "/static/types/generated/UserOverView"
import { useQuery } from "@apollo/react-hooks"
import styled from "styled-components"
import LangLink from "/components/LangLink"
import Button from "@material-ui/core/Button"
import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"
import { whichIsActive } from "/components/HeaderBar/Header"

interface ButtonProps {
  active: boolean
}
const StyledButton = styled(Button)<ButtonProps>`
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 18px;
  border-radius: 0px;
  @media (max-width: 950px) {
    font-size: 22px;
  }
  @media (max-width: 450px) {
    font-size: 16px;
  }
  color: ${props => (props.active ? "#00B290" : "black")};
  border-bottom: ${props => (props.active ? "1px solid #00B290" : "")};
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
  const { language, url } = useContext(LanguageContext)
  const active = whichIsActive({ url: url })
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
      <StyledButton color="inherit" variant="text" active={active == "profile"}>
        {userDisplayName}
      </StyledButton>
    </LangLink>
  )
}

export default ProfileButton
