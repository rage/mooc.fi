import { StudyModuleList } from "/components/NewLayout/Modules"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withNoSsr from "/util/withNoSsr"

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

export default withNoSsr(StudyModules)
