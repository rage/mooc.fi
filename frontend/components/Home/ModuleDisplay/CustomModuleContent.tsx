import { PropsWithChildren } from "react"

import { ClickableButtonBase } from "/components/Surfaces/ClickableCard"
import { CardText } from "/components/Text/paragraphs"
import ReactGA from "react-ga"

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

const CustomModuleContainer = styled.div`
  margin-top: calc(2rem - 24px);
  margin-left: calc(2rem - 24px);
  padding-top: 1rem;
  padding-left: 1rem;
  width: calc(100% - 24px);
  min-width: 33%;
`

interface CustomModuleContentProps {
  link?: string
  name?: string
  label?: string
}

const CustomModuleContent = ({
  children,
  link,
  name,
  label,
}: PropsWithChildren<CustomModuleContentProps>) => {
  const CustomModuleContentWrapper = ({ children }: PropsWithChildren<{}>) =>
    link ? (
      <ReactGA.OutboundLink
        eventLabel={`custommodulesite: ${name}`}
        to={link}
        target="_blank"
        style={{ textDecoration: "none", width: "100%" }}
        aria-label={label}
      >
        {children}
      </ReactGA.OutboundLink>
    ) : (
      <>{children}</>
    )

  return (
    <CustomModuleContainer>
      <Background focusRipple component="div" role="none">
        <CustomModuleContentWrapper>
          <ContentArea>
            <CardText component="p" paragraph variant="body1">
              {children}
            </CardText>
          </ContentArea>
        </CustomModuleContentWrapper>
      </Background>
    </CustomModuleContainer>
  )
}

export default CustomModuleContent
