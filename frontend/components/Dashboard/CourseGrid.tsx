import { range } from "remeda"

import { styled } from "@mui/material/styles"

import CourseCard from "./CourseCard"

import { CourseStatus, EditorCourseFieldsFragment } from "/graphql/generated"

interface CourseGridProps {
  courses?: EditorCourseFieldsFragment[]
  loading: boolean
  onClickStatus?: (
    value: CourseStatus | null,
  ) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const CourseList = styled("ul")`
  list-style: none;
  padding: 0;
`

const CourseGrid = ({ courses, loading, onClickStatus }: CourseGridProps) => (
  <section>
    <CourseList>
      {loading ? (
        range(0, 6).map((i) => <CourseCard key={`skeleton-${i}`} loading />)
      ) : (
        <>
          <CourseCard key="newcourse" />
          {courses?.map((course) => (
            <CourseCard
              key={course.id}
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
