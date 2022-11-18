import { StudyModuleFieldsFragment } from "/graphql/generated"
import { styled } from "@mui/material/styles"
import { ModuleCard, ModuleCardSkeleton } from "./ModuleCard"

const ModulesGrid = styled("ul")`
  list-style: none;
  list-style-position: inside;
  padding: 0;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  padding: 2rem;
  justify-content: center;
  width: 80%;
  @media (max-width: 500px) {
    padding: 0;
    width: 100%;
    grid-template-columns: 1fr;
  }
`
interface ModuleNaviListProps {
  modules?: Array<StudyModuleFieldsFragment> | null
  loading?: boolean
}

function ModuleNaviList({ modules, loading }: ModuleNaviListProps) {
  return (
    <ModulesGrid>
    {loading && (
      <>
        <ModuleCardSkeleton key="module-skeleton-1" />
        <ModuleCardSkeleton key="module-skeleton-2" />
        <ModuleCardSkeleton key="module-skeleton-3" />
      </>
    )}
    {modules?.map((module, index) => (
      <ModuleCard key={`module-${index}`} module={module} hue={100} />
    ))}
  </ModulesGrid>

  )
} 

export default ModuleNaviList