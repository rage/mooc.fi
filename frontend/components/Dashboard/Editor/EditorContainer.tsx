import { PropsWithChildren } from "react"

import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { WideContainer } from "/components/Container"

const Header = styled(Typography)`
  margin-top: 1em;
` as typeof Typography

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
