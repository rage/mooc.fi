import { useQuery } from "@apollo/client"
import { useRouter } from "next/router"

import {
  CourseEditorDetailsDocument,
  CourseEditorOtherCoursesDocument,
  CourseEditorTagsDocument,
  EditorStudyModulesDocument,
} from "/graphql/generated"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

interface UseEditorCoursesProps {
  slug?: string
}

export function useEditorCourses({ slug }: UseEditorCoursesProps) {
  const { locale } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale ?? "fi")

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

  const {
    data: tagsData,
    loading: tagsLoading,
    error: tagsError
  } = useQuery(CourseEditorTagsDocument, { variables: { language }})

  return {
    loading: courseLoading ?? studyModulesLoading ?? coursesLoading ?? tagsLoading,
    error: courseError ?? studyModulesError ?? coursesError ?? tagsError,
    courseData,
    studyModulesData,
    coursesData,
    tagsData
  }
}
