import React from "react"
import { WideContainer } from "/components/Container"
import { Typography } from "@material-ui/core"
import styled from "styled-components"
import DashboardBreadCrumbs from "/components/Dashboard/DashboardBreadCrumbs"

const Header = styled(Typography)`
  margin-top: 1em;
`

interface EditorContainerProps {
  title: string
  children: React.ReactNode
}
const EditorContainer = ({ title, children }: EditorContainerProps) => (
  <>
    <DashboardBreadCrumbs />
    <section>
      <WideContainer>
        <Header component="h1" variant="h2" gutterBottom={true} align="center">
          {title}
        </Header>
        {children}
      </WideContainer>
    </section>
  </>
)

export default EditorContainer
