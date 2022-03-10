import { PropsWithChildren } from "react"
import { WideContainer } from "/components/Container"
import { Typography } from "@mui/material"
import styled from "@emotion/styled"

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
