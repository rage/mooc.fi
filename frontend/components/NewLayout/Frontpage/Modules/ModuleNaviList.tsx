import { styled } from "@mui/material/styles"

import { ModuleCard, ModuleCardSkeleton } from "./ModuleCard"

import { StudyModuleFieldsFragment } from "/graphql/generated"

const Container = styled("nav")`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`

const ModulesGrid = styled("ul")(
  ({ theme }) => `
  list-style: none;
  list-style-position: inside;
  padding: 0;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  padding: 2rem;
  justify-content: center;
  width: 80%;

  ${theme.breakpoints.down("sm")}}} {
    padding: 0;
    width: 100%;
    grid-template-columns: 1fr;
  }
`,
)

interface ModuleNaviListProps {
  modules?: Array<StudyModuleFieldsFragment> | null
  variant?: "small" | "large"
  loading?: boolean
}

function ModuleNaviList({
  modules,
  loading,
  variant = "large",
}: ModuleNaviListProps) {
  return (
    <Container>
      <ModulesGrid>
        {loading && (
          <>
            <ModuleCardSkeleton key="module-skeleton-1" />
            <ModuleCardSkeleton key="module-skeleton-2" />
            <ModuleCardSkeleton key="module-skeleton-3" />
          </>
        )}
        {modules?.map((studyModule) => (
          <ModuleCard
            key={`module-${studyModule.id}`}
            module={studyModule}
            variant={variant}
          />
        ))}
      </ModulesGrid>
    </Container>
  )
}

export default ModuleNaviList
