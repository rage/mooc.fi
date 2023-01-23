import { useQuery } from "@apollo/client"

import {
  CourseEditorDetailsDocument,
  CourseEditorOtherCoursesDocument,
  EditorStudyModulesDocument,
} from "/graphql/generated"

interface UseEditorCoursesProps {
  slug?: string
}

export function useEditorCourses({ slug }: UseEditorCoursesProps) {
  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
  } = useQuery(CourseEditorDetailsDocument, {
    variables: { slug },
  })
  const {
    data: studyModulesData,
    loading: studyModulesLoading,
    error: studyModulesError,
  } = useQuery(EditorStudyModulesDocument)

  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
  } = useQuery(CourseEditorOtherCoursesDocument)

  return {
    loading: courseLoading ?? studyModulesLoading ?? coursesLoading,
    error: courseError ?? studyModulesError ?? coursesError,
    courseData,
    studyModulesData,
    coursesData,
  }
}
