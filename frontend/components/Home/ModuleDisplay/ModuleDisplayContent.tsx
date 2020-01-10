import React from "react"
import ModuleDescription from "/components/Home/ModuleDisplay/ModuleDescription"
import ModuleCoursesDisplay from "/components/Home/ModuleDisplay/ModuleCoursesDisplay"
import styled from "styled-components"
import { AllCourses_courses as CourseData } from "/static/types/generated/AllCourses"

const CenteredContent = styled.div`
  width: 80%;
  margin: auto;
  @supports (display: grid) {
    display: grid;
    grid-gap: 10px;
    align-content: space-around;
    grid-template-columns: 1fr;
    grid-auto-rows: 1fr;
    @media only screen and (min-width: 1000px) {
      grid-template-columns: 45% 55%;
      grid-auto-rows: 1fr;
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
