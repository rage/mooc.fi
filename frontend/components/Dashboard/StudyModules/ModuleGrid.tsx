import { Grid } from "@mui/material"
import { range } from "lodash"

import ModuleCard from "./ModuleCard"
import { AllEditorModulesWithTranslations_study_modules } from "/static/types/generated/AllEditorModulesWithTranslations"

interface ModuleGridProps {
  modules?: AllEditorModulesWithTranslations_study_modules[]
  loading: boolean
}

const ModuleGrid = ({ modules, loading }: ModuleGridProps) => (
  <section>
    <Grid container spacing={3}>
      {loading ? (
        range(4).map((i) => (
          <ModuleCard key={`module-skeleton-${i}`} loading={true} />
        ))
      ) : (
        <>
          {modules?.map((module) => (
            <ModuleCard key={module.slug} module={module} />
          ))}
          <ModuleCard key={"newmodule"} />
        </>
      )}
    </Grid>
  </section>
)

export default ModuleGrid
