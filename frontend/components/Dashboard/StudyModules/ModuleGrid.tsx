import { range } from "remeda"

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
        range(0, 4).map((i) => (
          <ModuleCard key={`module-skeleton-${i}`} loading />
        ))
      ) : (
        <>
          {modules?.map((studyModule) => (
            <ModuleCard
              key={studyModule.slug}
              image={
                studyModule.image
                  ? require(`/public/images/modules/${studyModule.image}`)
                  : require(`/public/images/modules/${studyModule.slug}.jpg`)
              }
              studyModule={studyModule}
            />
          ))}
          <ModuleCard key="newmodule" />
        </>
      )}
    </Grid>
  </section>
)

export default ModuleGrid
