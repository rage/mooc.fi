import { CenteredContent } from "/components/Home/ModuleDisplay/Common"
import ModuleCoursesDisplay from "/components/Home/ModuleDisplay/ModuleCoursesDisplay"
import ModuleDescription from "/components/Home/ModuleDisplay/ModuleDescription"

import { CourseFieldsFragment } from "/static/types/generated"

interface ModuleDisplayProps {
  name: string
  description: string | JSX.Element
  orderedCourses?: CourseFieldsFragment[]
}
const ModuleDisplayContent = (props: ModuleDisplayProps) => {
  const { name, description, orderedCourses = [] } = props
  return (
    <CenteredContent>
      <ModuleDescription name={name} description={description} />
      <ModuleCoursesDisplay courses={orderedCourses} />
    </CenteredContent>
  )
}

export default ModuleDisplayContent
