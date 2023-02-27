import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"

import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

import {
  CourseEditorDetailsDocument,
  CourseEditorOtherCoursesDocument,
  CourseEditorTagsDocument,
  EditorStudyModulesDocument,
} from "/graphql/generated"

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
    error: tagsError,
  } = useQuery(CourseEditorTagsDocument, {
    variables: {
      language,
      includeWithNoCourses: true,
    },
  })

  return {
    loading:
      courseLoading ?? studyModulesLoading ?? coursesLoading ?? tagsLoading,
    error: courseError ?? studyModulesError ?? coursesError ?? tagsError,
    courseData,
    studyModulesData,
    coursesData,
    tagsData,
  }
}
