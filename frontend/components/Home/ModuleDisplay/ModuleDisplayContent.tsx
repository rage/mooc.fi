import ModuleDescription from "/components/Home/ModuleDisplay/ModuleDescription"
import ModuleCoursesDisplay from "/components/Home/ModuleDisplay/ModuleCoursesDisplay"
import styled from "@emotion/styled"
import { AllCourses_courses as CourseData } from "/static/types/generated/AllCourses"

const CenteredContent = styled.div`
  width: 80%;
  margin: auto;
  @supports (display: grid) {
    display: grid;
    grid-gap: 15px;
    align-content: space-around;
    grid-template-columns: 1fr;

    @media only screen and (min-width: 1200px) {
      grid-template-columns: 45% 55%;
      grid-auto-rows: 1fr;
      width: 90%;
    }
  }
`
interface ModuleDisplayProps {
  name: string
  description: string
  orderedCourses: CourseData[]
}
const ModuleDisplayContent = (props: ModuleDisplayProps) => {
  const { name, description, orderedCourses } = props
  return (
    <CenteredContent>
      <ModuleDescription name={name} description={description} />
      <ModuleCoursesDisplay courses={orderedCourses} />
    </CenteredContent>
  )
}

export default ModuleDisplayContent
