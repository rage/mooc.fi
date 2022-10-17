import { useMemo } from "react"

import { range } from "lodash"

import styled from "@emotion/styled"

import CourseCard from "./CourseCard"
import { useFilterContext } from "/contexts/FilterContext"
import notEmpty from "/util/notEmpty"

const CourseList = styled.ul``

const CourseGrid = () => {
  const { loading, coursesData } = useFilterContext()

  const courses = useMemo(
    () => coursesData?.courses?.filter(notEmpty) ?? [],
    [coursesData],
  )

  return (
    <section>
      <CourseList>
        {loading ? (
          range(6).map((i) => (
            <CourseCard key={`skeleton-${i}`} loading={true} />
          ))
        ) : (
          <>
            <CourseCard key="newcourse" />
            {courses?.map((course) => (
              <CourseCard
                key={`${course.id}-${course.status}`}
                course={course}
                loading={loading}
              />
            ))}
          </>
        )}
      </CourseList>
    </section>
  )
}

export default CourseGrid
