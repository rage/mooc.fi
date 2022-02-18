import { PropsWithChildren } from "react"

import { H2NoBackground, SubtitleNoBackground } from "/components/Text/headers"

import styled from "@emotion/styled"

export const CenteredContent = styled.div`
  width: 80%;
  margin: auto;
  @supports (display: grid) {
    display: grid;
    grid-gap: 15px;
    align-content: space-around;
    grid-template-columns: 1fr;

    @media only screen and (min-width: 1200px) {
      grid-template-columns: 45% 55%;
      grid-auto-rows: 1fr;
      width: 90%;
    }
  }
`

export const ContentContainer = styled.div`
  margin: 1rem;
  padding-left: 1rem;
  min-width: 33%;
`

const ModuleHeaderBase = styled(H2NoBackground)`
  color: white;
  margin-left: 0px;
  font-size: 72px;
  line-height: 100px;
  font-family: Open sans condensed, sans serif;
  font-weight: 300;
  @media (max-width: 490px) {
    font-size: 48px;
    line-height: 80px;
  }
  @media (max-width: 360px) {
    font-size: 37px;
    line-height: 70px;
  }
`

export const ModuleHeader = ({ children, ...props }: PropsWithChildren<{}>) => (
  <ModuleHeaderBase component="h2" variant="h2" align="left" {...props}>
    {children}
  </ModuleHeaderBase>
)

const ModuleDescriptionTextBase = styled(SubtitleNoBackground)`
  color: white;
  font-size: 28px;
  line-height: 47px;
  @media (max-width: 360px) {
    font-size: 18px;
    line-height: 37px;
  }
`

export const ModuleDescriptionText = ({
  children,
  ...props
}: PropsWithChildren<{}>) => (
  <ModuleDescriptionTextBase variant="subtitle1" component="h3" {...props}>
    {children}
  </ModuleDescriptionTextBase>
)
