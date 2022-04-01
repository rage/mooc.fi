import { useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import { Button } from "@mui/material"
import { useRouter } from "next/router"
import { SectionContainer, SectionTitle } from "/components/NewLayout/Common"
import {
  CardBody,
  CardDescription,
  CardTitle,
  CardWrapper,
} from "/components/NewLayout/Common/Card"
import { AllModulesQuery } from "/graphql/queries/study-modules"
import {
  AllModules,
  AllModules_study_modules,
} from "/static/types/generated/AllModules"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"
import notEmpty from "/util/notEmpty"

const ModulesGrid = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  padding: 2rem;
  justify-content: center;
  width: 80%;
`

const CardHeader = styled.div`
  height: 140px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
`

const BackgroundImage = styled.span<{
  image: string
  hue?: number
  brightness?: number
}>`
  opacity: 0.4;
  filter: hue-rotate(${(props) => props.hue ?? 0}deg)
    brightness(${(props) => props.brightness ?? 1});
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${(props) => `../../../static/images/${props.image}`});
  background-size: cover;
`

const ModuleButton = styled(Button)<{ hue?: number; brightness?: number }>`
  filter: hue-rotate(${(props) => props.hue ?? 0}deg)
    brightness(${(props) => props.brightness ?? 1});
`

const CardActionArea = styled.div`
  text-align: right;
`

interface ModuleCardProps {
  module: AllModules_study_modules
  hue?: number
  brightness?: number
}

const ModuleCard = ({
  module: { name, image, description },
  hue,
  brightness,
}: ModuleCardProps) => {
  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <BackgroundImage
          hue={hue}
          brightness={brightness}
          image={image ?? ""}
        />
      </CardHeader>
      <CardBody>
        <CardDescription>{description}</CardDescription>
        <CardActionArea>
          <ModuleButton hue={hue} brightness={brightness}>
            Kokonaisuuden tiedot
          </ModuleButton>
        </CardActionArea>
      </CardBody>
    </CardWrapper>
  )
}

function Modules() {
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading, data } = useQuery<AllModules>(AllModulesQuery, {
    variables: { language },
  })

  return (
    <SectionContainer>
      <SectionTitle>Opintokokonaisuudet</SectionTitle>
      {loading && <p>Loading...</p>}
      <ModulesGrid>
        {data?.study_modules &&
          data.study_modules
            .filter(notEmpty)
            .map((module, index) => (
              <ModuleCard key={`module-${index}`} module={module} hue={100} />
            ))}
      </ModulesGrid>
    </SectionContainer>
  )
}

export default Modules
