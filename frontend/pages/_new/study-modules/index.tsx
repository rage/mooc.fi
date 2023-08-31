import Background from "components/NewLayout/Background"

import { StudyModuleList } from "/components/NewLayout/Modules"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"

function StudyModules() {
  useBreadcrumbs([
    {
      translation: "studyModules",
      href: "/_new/study-modules",
    },
  ])

  return (
    <>
      <Background />
      <StudyModuleList />
    </>
  )
}

export default StudyModules
