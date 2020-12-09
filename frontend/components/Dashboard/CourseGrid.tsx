import CourseCard from "./CourseCard"
import { AllEditorCourses_courses } from "/static/types/generated/AllEditorCourses"
import { range } from "lodash"
import styled from "styled-components"

interface CourseGridProps {
  courses?: AllEditorCourses_courses[]
  loading: boolean
}

const CourseList = styled.ul``

const CourseGrid = ({ courses, loading }: CourseGridProps) => (
  <section>
    <CourseList>
      {loading ? (
        range(6).map((i) => <CourseCard key={`skeleton-${i}`} loading={true} />)
      ) : (
        <>
          <CourseCard key="newcourse" />
          {courses?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </>
      )}
    </CourseList>
  </section>
)

export default CourseGrid
