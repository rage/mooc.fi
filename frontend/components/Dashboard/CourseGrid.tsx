import { useMemo } from "react"

import { range } from "remeda"

import { styled } from "@mui/material/styles"

import CourseCard from "./CourseCard"
import { useFilterContext } from "/contexts/FilterContext"
import { isDefinedAndNotEmpty } from "/util/guards"

const CourseList = styled("ul")`
  list-style: none;
  padding: 0;
`

const CourseGrid = () => {
  const { loading, coursesData } = useFilterContext()

  const courses = useMemo(
    () => coursesData?.courses?.filter(isDefinedAndNotEmpty) ?? [],
    [coursesData],
  )

  return (
    <section>
      <CourseList>
        {loading ? (
          range(0, 6).map((i) => <CourseCard key={`skeleton-${i}`} loading />)
        ) : (
          <>
            <CourseCard key="newcourse" isNew />
            {courses?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </>
        )}
      </CourseList>
    </section>
  )
}

export default CourseGrid
