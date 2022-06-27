import styled from "@emotion/styled"
import { range } from "lodash"

import CourseCard from "./CourseCard"
import { AllEditorCourses_courses } from "/static/types/generated/AllEditorCourses"
import { CourseStatus } from "/static/types/generated/globalTypes"

interface CourseGridProps {
  courses?: AllEditorCourses_courses[]
  loading: boolean
  onClickStatus?: (
    value: CourseStatus | null,
  ) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const CourseList = styled.ul``

const CourseGrid = ({ courses, loading, onClickStatus }: CourseGridProps) => (
  <section>
    <CourseList>
      {loading ? (
        range(6).map((i) => <CourseCard key={`skeleton-${i}`} loading={true} />)
      ) : (
        <>
          <CourseCard key="newcourse" />
          {courses?.map((course) => (
            <CourseCard
              key={`${course.id}-${course.status}`}
              course={course}
              onClickStatus={onClickStatus}
            />
          ))}
        </>
      )}
    </CourseList>
  </section>
)

export default CourseGrid
