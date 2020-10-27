import { Grid } from "@material-ui/core"
import CourseCard from "./CourseCard"
import { AllEditorCourses_courses } from "/static/types/generated/AllEditorCourses"
import { range } from "lodash"

interface CourseGridProps {
  courses?: AllEditorCourses_courses[]
  loading: boolean
}

const CourseGrid = ({ courses, loading }: CourseGridProps) => (
  <section>
    <Grid container spacing={3} style={{ marginBottom: "2em" }}>
      {loading ? (
        range(6).map((i) => <CourseCard key={`skeleton-${i}`} loading={true} />)
      ) : (
        <>
          <CourseCard key={"newcourse"} />
          {courses?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </>
      )}
    </Grid>
  </section>
)

export default CourseGrid
