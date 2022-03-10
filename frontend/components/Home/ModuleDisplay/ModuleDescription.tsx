import {
  ContentContainer,
  ModuleDescriptionText,
  ModuleHeader,
} from "/components/Home/ModuleDisplay/Common"

interface DescriptionProps {
  name: string
  description: string | JSX.Element
}
const ModuleDescription = (props: DescriptionProps) => {
  const { name, description } = props
  return (
    <ContentContainer>
      <ModuleHeader>{name}</ModuleHeader>
      <ModuleDescriptionText>{description}</ModuleDescriptionText>
    </ContentContainer>
  )
}

export default ModuleDescription
