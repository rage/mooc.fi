import { PropsWithChildren } from "react"

import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { WideContainer } from "/components/Container"

const Header = styled(Typography)`
  margin-top: 1em;
` as typeof Typography

const ResponsiveContainer = styled(WideContainer)(
  ({ theme }) => `
  ${theme.breakpoints.down("md")} {
    width: 100%;
    padding: 0;
  }
`,
)

const EditorContainer = ({
  title,
  children,
}: PropsWithChildren<{ title: string }>) => (
  <>
    <section>
      <ResponsiveContainer>
        <Header component="h1" variant="h2" gutterBottom={true} align="center">
          {title}
        </Header>
        {children}
      </ResponsiveContainer>
    </section>
  </>
)

export default EditorContainer
