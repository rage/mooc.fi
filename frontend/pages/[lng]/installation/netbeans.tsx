import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import getUserOS from "/util/getUserOS"
import OSSelector from "/components/Installation/OSSelector"
import MDX_Linux from "/static/md_pages/netbeans_installation_fi.mdx"
import MDX_Windows from "/static/md_pages/netbeans_installation_windows_fi.mdx"

const Background = styled.section`
  background-color: #006877;
`

const Title = styled(Typography)`
  margin-top: 1em;
  margin-bottom: 0.4em;
`

const Subtitle = styled(Typography)`
  padding: 0.3em;
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
  let userOS = getUserOS()
  userOS = "Windows"

  return (
    <Background>
      <TitleBackground>
        <Title component="h1" variant="h1" align="center">
          title
        </Title>
        <Subtitle variant="subtitle1" align="center">
          subtitle
        </Subtitle>
      </TitleBackground>
      <ContentBox>
        <OSSelector OS={userOS} />
        {userOS === "Linux" ? <MDX_Linux /> : <MDX_Windows />}
      </ContentBox>
    </Background>
  )
}

NetBeans.getInitialProps = () => {
  return {}
}

export default NetBeans
