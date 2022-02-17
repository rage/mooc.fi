import { PropsWithChildren } from "react"

import { ContentContainer } from "/components/Home/ModuleDisplay/ModuleDescription"
import { ClickableButtonBase } from "/components/Surfaces/ClickableCard"
import { CardText } from "/components/Text/paragraphs"

import styled from "@emotion/styled"

const Background = styled(ClickableButtonBase)<{ component: string }>`
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #fcfcfa;
  height: 100%;
  width: 100%;
  @media (min-width: 960px) {
    min-height: 150px;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    min-height: 250px;
  }
`

const ContentArea = styled.div`
  padding: 1rem 1rem 2rem 1rem;
  flex-direction: column;
  display: flex;
  flex: 1;
`

const CustomModuleContainer = styled(ContentContainer)`
  margin-top: calc(2rem - 24px);
  margin-left: calc(2rem - 24px);
  padding-top: 1rem;
  padding-left: 1rem;
  width: calc(100% - 24px);
`

interface CustomModuleContentProps {}

const CustomModuleContent = ({
  children,
}: PropsWithChildren<CustomModuleContentProps>) => {
  return (
    <CustomModuleContainer>
      <Background focusRipple component="div" role="none">
        <ContentArea>
          <CardText component="p" paragraph variant="body1">
            {children}
          </CardText>
        </ContentArea>
      </Background>
    </CustomModuleContainer>
  )
}

export default CustomModuleContent
