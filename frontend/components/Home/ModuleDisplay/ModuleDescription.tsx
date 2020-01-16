import React from "react"
import styled from "styled-components"
import { H2NoBackground, SubtitleNoBackground } from "/components/Text/headers"

export const ContentContainer = styled.div`
  margin: 1rem;
  padding-left: 1rem;
`
const ModuleHeader = styled(H2NoBackground)`
  color: white;
  margin-left: 0px;
  font-size: 72px;
  line-height: 100px;
  font-family: Open sans condensed, sans serif;
  font-weight: 300;
  @media (max-width: 360px) {
    font-size: 57px;
    line-height: 100px;
  }
`

const ModuleDescriptionText = styled(SubtitleNoBackground)`
  color: white;
  font-size: 28px;
  line-height: 47px;
`

interface DescriptionProps {
  name: string
  description: string
}
const ModuleDescription = (props: DescriptionProps) => {
  const { name, description } = props
  return (
    <ContentContainer>
      <ModuleHeader component="h2" variant="h2" align="left">
        {name}
      </ModuleHeader>
      <ModuleDescriptionText variant="subtitle1">
        {description}
      </ModuleDescriptionText>
    </ContentContainer>
  )
}

export default ModuleDescription
