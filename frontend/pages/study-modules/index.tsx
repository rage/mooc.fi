import { StudyModuleList } from "/components/NewLayout/Modules"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"

function StudyModules() {
  useBreadcrumbs([
    {
      translation: "studyModules",
      href: "/study-modules",
    },
  ])

  return (
    <>
      <StudyModuleList />
    </>
  )
}

export default StudyModules
