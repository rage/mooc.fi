import React from "react"
import { Grid } from "@material-ui/core"
import ModuleCard from "./ModuleCard"
import { AllEditorModulesWithTranslations_study_modules } from "/static/types/generated/AllEditorModulesWithTranslations"

interface ModuleGridProps {
  modules: AllEditorModulesWithTranslations_study_modules[]
}

function ModuleGrid(props: ModuleGridProps) {
  const { modules } = props
  return (
    <section>
      <Grid container spacing={3}>
        {(modules || []).map(module => (
          <ModuleCard key={module.slug} module={module} />
        ))}
        <ModuleCard key={"newmodule"} />
      </Grid>
    </section>
  )
}

export default ModuleGrid
