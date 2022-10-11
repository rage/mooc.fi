import { PropsWithChildren } from "react"

import styled from "@emotion/styled"
import { Typography } from "@mui/material"

import { WideContainer } from "/components/Container"

const Header = styled(Typography)<any>`
  margin-top: 1em;
`

const EditorContainer = ({
  title,
  children,
}: PropsWithChildren<{ title: string }>) => (
  <>
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
