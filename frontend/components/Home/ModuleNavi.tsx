import { styled } from "@mui/material/styles"

import ModuleNaviCard from "./ModuleNaviCard"
import Container from "/components/Container"
import { H2Background } from "/components/Text/headers"
import { useTranslator } from "/hooks/useTranslator"
import HomeTranslations from "/translations/home"

import { StudyModuleFieldsFragment } from "/graphql/generated"

const NaviArea = styled("section")`
  margin-bottom: 5em;
  margin-top: 5em;
`

const NaviTitle = styled(H2Background)`
  margin-top: 1.3em;
  margin-bottom: 1em;
  border-bottom: 5px solid #00281c;
  font-size: 1.5rem;
`

// Browsers without css grid support will see the cards below each other
const Grid = styled("div")`
  @supports (display: grid) {
    display: grid;
    grid-gap: 50px;
    align-content: space-around;

    /* On small screens allow the cards to be really narrow */
    grid-template-columns: 1fr;
    grid-auto-rows: 1fr;

    /*
     Automatically place the cards on the grid so that they resize based on content,
     are all the same height, and don't get narrower than 500px.
    */
    @media only screen and (min-width: 500px) {
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      grid-auto-rows: 1fr;
    }
  }
`

interface ModuleNaviProps {
  studyModules?: StudyModuleFieldsFragment[]
  loading: boolean
}

const ModuleNavi = ({ studyModules, loading }: ModuleNaviProps) => {
  const t = useTranslator(HomeTranslations)

  return (
    <NaviArea>
      <NaviTitle
        component="h2"
        variant="h2"
        align="center"
        fontcolor="#00281C"
        titlebackground="#ffffff"
      >
        {t("modulesTitle")}
      </NaviTitle>
      <Container>
        <Grid>
          {loading ? (
            <>
              <ModuleNaviCard key="skeletonnavicard1" />
              <ModuleNaviCard key="skeletonnavicard2" />
            </>
          ) : (
            studyModules?.map((studyModule) => (
              <ModuleNaviCard
                key={studyModule.id ?? studyModule.slug}
                studyModule={studyModule}
              />
            ))
          )}
        </Grid>
      </Container>
    </NaviArea>
  )
}

export default ModuleNavi
