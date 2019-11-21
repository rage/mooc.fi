import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import ModuleNaviCard from "./ModuleNaviCard"
import Container from "/components/Container"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"
import { AllModules_study_modules } from "/static/types/generated/AllModules"
import { H2Background } from "/components/Text/headers"

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
      <H2Background
        component="h2"
        variant="h2"
        align="center"
        fontcolor="#ffffff"
        titlebackground="rgba(34, 141, 189)"
      >
        {t("modulesTitle")}
      </H2Background>
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
