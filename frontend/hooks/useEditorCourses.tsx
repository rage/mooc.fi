import { useQuery } from "@apollo/client"

import {
  CourseEditorDetailsQuery,
  CourseEditorOtherCoursesQuery,
} from "/graphql/queries/course"
import { EditorStudyModulesQuery } from "/graphql/queries/studyModule"
import {
  CourseEditorDetailsQueryResult,
  CourseEditorOtherCoursesQueryResult,
  EditorStudyModulesQueryResult,
} from "/static/types/generated"

interface UseEditorCoursesProps {
  slug?: string
}

export function useEditorCourses({ slug }: UseEditorCoursesProps) {
  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
  } = useQuery<CourseEditorDetailsQueryResult>(CourseEditorDetailsQuery, {
    variables: { slug },
  })
  const {
    data: studyModulesData,
    loading: studyModulesLoading,
    error: studyModulesError,
  } = useQuery<EditorStudyModulesQueryResult>(EditorStudyModulesQuery)

  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
  } = useQuery<CourseEditorOtherCoursesQueryResult>(
    CourseEditorOtherCoursesQuery,
  )

  return {
    loading: courseLoading || studyModulesLoading || coursesLoading,
    error: courseError || studyModulesError || coursesError,
    courseData,
    studyModulesData,
    coursesData,
  }
}
