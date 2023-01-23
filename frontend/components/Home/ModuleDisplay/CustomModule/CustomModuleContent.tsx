import { PropsWithChildren } from "react"

import { MDXComponents } from "mdx/types"

import { MDXProvider } from "@mdx-js/react"
import { Paper } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  ModuleCardText,
  ModuleCardTitle,
} from "/components/Home/ModuleDisplay/Common"

const Background = styled(Paper)`
  background-color: white;
  position: relative;
  box-shadow: 18px 7px 28px -12px rgba(0, 0, 0, 0.41);
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  justify-content: center; // flex-start;
  background-color: #fcfcfa;
  // height: 100%;
  width: 100%;
  @media (min-width: 960px) {
    min-height: 150px;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    min-height: 250px;
  }
`

const ContentArea = styled("div")`
  padding: 1rem 1rem 2rem 1rem;
  flex-direction: column;
  display: flex;
  flex: 1;
`

const CustomModuleContainer = styled("div")`
  margin-top: calc(2rem - 24px);
  margin-left: calc(2rem - 24px);
  padding-top: 1rem;
  padding-left: 1rem;
  width: calc(100% - 24px);
  min-width: 33%;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
`

const components: MDXComponents = {
  h3: ModuleCardTitle as React.ElementType,
  p: ModuleCardText as React.ElementType,
}

export const CustomModuleContent = ({ children }: PropsWithChildren) => {
  return (
    <MDXProvider components={components}>
      <CustomModuleContainer>
        <Background>
          <ContentArea>{children}</ContentArea>
        </Background>
      </CustomModuleContainer>
    </MDXProvider>
  )
}
