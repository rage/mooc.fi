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
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(15vw, 1fr));
  padding: 2rem;
  justify-content: center;
  width: 80%;

  ${theme.breakpoints.down("lg")} {
    grid-template-columns: repeat(auto-fit, minmax(30vw, 1fr));
  }
  ${theme.breakpoints.down("sm")} {
    padding: 1rem;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  ${theme.breakpoints.down("xxs")} {
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
            key={studyModule.id}
            module={studyModule}
            variant={variant}
          />
        ))}
      </ModulesGrid>
    </Container>
  )
}

export default ModuleNaviList
