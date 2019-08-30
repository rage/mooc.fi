import React, { useContext } from "react"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import ModuleNaviCard from "./ModuleNaviCard"
import Container from "/components/Container"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"
import { AllModules_study_modules } from "/static/types/generated/AllModules"
import styled from "styled-components"

const Title = styled(Typography)`
  margin: 2rem auto 1rem auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: table;
  background-color: rgba(34, 141, 189);
  color: #ffffff;
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
    <section style={{ marginBottom: "5em" }}>
      <Title component="h2" variant="h2" align="center">
        {t("modulesTitle")}
      </Title>
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
    </section>
  )
}

export default ModuleNavi
