import React from "react"
import { Grid } from "@material-ui/core"
import ModuleCard from "./ModuleCard"
import { AllModules_study_modules } from "./../static/types/AllModules"

interface ModuleGridProps {
  modules: AllModules_study_modules[]
}

function ModuleGrid(props: ModuleGridProps) {
  const { modules } = props
  return (
    <section>
      <Grid container spacing={3}>
        {(modules || []).map(module => (
          <ModuleCard key={module.id} module={module} />
        ))}
        <ModuleCard key={"newmodule"} />
      </Grid>
    </section>
  )
}

export default ModuleGrid
