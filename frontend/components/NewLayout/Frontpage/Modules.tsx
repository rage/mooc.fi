import { useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import { Button, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { AllModulesQuery } from "/graphql/queries/study-modules"
import {
  AllModules,
  AllModules_study_modules,
} from "/static/types/generated/AllModules"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"
import notEmpty from "/util/notEmpty"

const ModulesContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  width: 100%;
`

const ModulesGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  padding: 2rem;
`

const CardWrapper = styled.div`
  position: relative;
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border: 1px solid #ececec;
  min-height: 300px;
  overflow: hidden;
  height: 100%;
  flex-flow: column;
`

const CardHeader = styled.div`
  height: 140px;
  overflow: hidden;
  position: relative;
`

const BackgroundImage = styled.span<{ image: string }>`
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  background-image: url(${(props) => `../../../static/images/${props.image}`});
`

const Title = styled(Typography)``
const CardBody = styled.div`
  background-color: #fff;
  display: flex;
  flex: 1 1 auto;
`
const CardActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const ModuleCard = ({ name, description, image }: AllModules_study_modules) => {
  console.log("image", image)
  return (
    <CardWrapper>
      <CardHeader>
        <Title variant="h6">{name}</Title>
        <BackgroundImage image={image ?? ""} />
      </CardHeader>
      <CardBody>{description}</CardBody>
      <CardActionArea>
        <Button>Kokonaisuuden tiedot</Button>
      </CardActionArea>
    </CardWrapper>
  )
}
function Modules() {
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading, error, data } = useQuery<AllModules>(AllModulesQuery, {
    variables: { language },
  })

  return (
    <ModulesContainer>
      <Typography variant="h1">Opintokokonaisuudet</Typography>
      {loading && <p>Loading...</p>}
      <ModulesGrid>
        {data?.study_modules &&
          data.study_modules
            .filter(notEmpty)
            .map((module, index) => <ModuleCard key={index} {...module} />)}
      </ModulesGrid>
    </ModulesContainer>
  )
}

export default Modules
