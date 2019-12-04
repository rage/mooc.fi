import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import getUserOS from "/util/getUserOS"
import OSSelector from "/components/Installation/OSSelector"
//@ts-ignore
import MDX_Linux from "/static/md_pages/netbeans_installation_fi.mdx"
import MDX_Windows from "/static/md_pages/netbeans_installation_windows_fi.mdx"
import UserOSContext from "/contexes/UserOSContext"
import { userOsType } from "/util/getUserOS"
import NoOsMessage from "/components/Installation/NoOsMessage"

const Background = styled.section`
  background-color: #006877;
  padding: 1rem;
`

const Title = styled(Typography)`
  margin-bottom: 0.4em;
  padding: 1rem;
`
const TitleBackground = styled.div`
  background-color: white;
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
`

export const ContentBox = styled.div`
  background-color: white;
  max-width: 80%;
  border: 3px solid gray;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  padding: 3em;
  margin-bottom: 3em;
`

const NetBeans = () => {
  const [userOS, setUserOs] = React.useState<userOsType>(getUserOS())
  const changeOS = (OS: userOsType) => {
    setUserOs(OS)
  }

  return (
    <UserOSContext.Provider value={{ OS: userOS, changeOS: changeOS }}>
      <Background>
        <TitleBackground>
          <Title component="h1" variant="h1" align="center">
            title
          </Title>
        </TitleBackground>
        <ContentBox>
          <OSSelector />
          {userOS === "OS" ? <NoOsMessage /> : <MDX_Windows />}
        </ContentBox>
      </Background>
    </UserOSContext.Provider>
  )
}

NetBeans.getInitialProps = () => {
  return {}
}

export default NetBeans
