import React from "react"
import styled from "styled-components"
import { H2Background, SubtitleNoBackground } from "/components/Text/headers"

export const ContentContainer = styled.div`
  position: relative;
  margin: 1rem;
`
const ModuleHeader = styled(H2Background)`
  font-size: 88px;
  line-height: 128px;
  margin-bottom: 4rem;
`

const ModuleDescriptionText = styled(SubtitleNoBackground)`
  color: white;
`

interface DescriptionProps {
  name: string
  description: string
}
const ModuleDescription = (props: DescriptionProps) => {
  const { name, description } = props
  return (
    <ContentContainer style={{ width: "40%" }}>
      <ModuleHeader
        component="h2"
        variant="h2"
        align="left"
        fontcolor="white"
        titlebackground="black"
      >
        {name}
      </ModuleHeader>
      <ModuleDescriptionText variant="subtitle1">
        {description}
      </ModuleDescriptionText>
    </ContentContainer>
  )
}

export default ModuleDescription
