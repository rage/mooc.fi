import { range } from "lodash"

import { Grid } from "@mui/material"

import ModuleCard from "./ModuleCard"

import { StudyModuleDetailedFieldsFragment } from "/graphql/generated"

interface ModuleGridProps {
  modules?: StudyModuleDetailedFieldsFragment[] | null
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
