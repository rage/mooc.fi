import { CenteredContent } from "/components/Home/ModuleDisplay/Common"
import ModuleCoursesDisplay from "/components/Home/ModuleDisplay/ModuleCoursesDisplay"
import ModuleDescription from "/components/Home/ModuleDisplay/ModuleDescription"
import { AllCourses_courses as CourseData } from "/static/types/generated/AllCourses"

interface ModuleDisplayProps {
  name: string
  description: string | JSX.Element
  orderedCourses?: CourseData[]
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
