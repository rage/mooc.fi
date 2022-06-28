import {
  CourseEditorStudyModuleQuery,
  CourseEditorCoursesQuery,
} from "/graphql/queries/courses"
import { CourseQuery } from "/graphql/queries/courses"
import { CourseDetails } from "/static/types/generated/CourseDetails"
import { CourseEditorCourses } from "/static/types/generated/CourseEditorCourses"
import { CourseEditorStudyModules } from "/static/types/generated/CourseEditorStudyModules"
import { useQuery } from "@apollo/client"

interface UseEditorCoursesProps {
  slug?: string
}

export function useEditorCourses({ slug }: UseEditorCoursesProps) {
  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
  } = useQuery<CourseDetails>(CourseQuery, {
    variables: { slug },
  })
  const {
    data: studyModulesData,
    loading: studyModulesLoading,
    error: studyModulesError,
  } = useQuery<CourseEditorStudyModules>(CourseEditorStudyModuleQuery)

  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
  } = useQuery<CourseEditorCourses>(CourseEditorCoursesQuery)

  return {
    loading: courseLoading || studyModulesLoading || coursesLoading,
    error: courseError || studyModulesError || coursesError,
    courseData,
    studyModulesData,
    coursesData,
  }
}
