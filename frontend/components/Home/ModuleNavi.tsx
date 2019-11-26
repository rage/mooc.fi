import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import ModuleNaviCard from "./ModuleNaviCard"
import Container from "/components/Container"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"
import { AllModules_study_modules } from "/static/types/generated/AllModules"
import { H2Background } from "/components/Text/headers"
import styled from "styled-components"

const NaviArea = styled.section`
  margin-bottom: 5em;
  margin-top: 5em;
`

const NaviTitle = styled(H2Background)`
  margin-top: 1.3em;
  margin-bottom: 1em;
  border-bottom: 5px solid #00281c;
`
const ModuleNavi = ({
  modules,
  loading,
}: {
  modules?: AllModules_study_modules[]
  loading: boolean
}) => {
  const lng = useContext(LanguageContext)
  const t = getHomeTranslator(lng.language)

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
        <Grid container spacing={5}>
          {loading ? (
            <>
              <ModuleNaviCard key="skeletonnavicard1" />
              <ModuleNaviCard key="skeletonnavicard2" />
            </>
          ) : (
            (modules || []).map(module => (
              <ModuleNaviCard key={`module-${module.name}`} module={module} />
            ))
          )}
        </Grid>
      </Container>
    </NaviArea>
  )
}

export default ModuleNavi
