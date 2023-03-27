import { useMemo } from "react"

import { omit } from "lodash"

import { useMutation, useQuery } from "@apollo/client"

import { toCourseForm } from "/components/Dashboard/Editor/Course/serialization"

import {
  AddCourseDocument,
  CourseEditorDetailsDocument,
  CourseEditorOtherCoursesDocument,
  CourseEditorTagsDocument,
  CoursesDocument,
  DeleteCourseDocument,
  EditorCoursesDocument,
  EditorStudyModulesDocument,
  UpdateCourseDocument,
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

  const {
    data: tagsData,
    loading: tagsLoading,
    error: tagsError,
  } = useQuery(CourseEditorTagsDocument, {
    variables: {
      includeWithNoCourses: true,
    },
  })
  const [addCourse, { loading: addCourseLoading, error: addCourseError }] =
    useMutation(AddCourseDocument)
  const [
    updateCourse,
    { loading: updateCourseLoading, error: updateCourseError },
  ] = useMutation(UpdateCourseDocument)
  const [
    deleteCourse,
    { loading: deleteCourseLoading, error: deleteCourseError },
  ] = useMutation(DeleteCourseDocument, {
    refetchQueries: [
      { query: CoursesDocument },
      { query: EditorCoursesDocument },
      { query: CourseEditorOtherCoursesDocument },
    ],
  })

  const data = useMemo(() => {
    const course = courseData?.course ?? undefined
    const courses = coursesData?.courses ?? []
    const studyModules = studyModulesData?.study_modules ?? []
    const tags = tagsData?.tags ?? []

    const defaultValues = toCourseForm({
      course,
      modules: studyModules,
    })
    const tagOptions = (tags ?? []).map((tag) => ({
      ...omit(tag, ["__typename", "id"]),
      _id: tag.id,
      types: tag.types ?? [],
      tag_translations: (tag.tag_translations ?? []).map((translation) => ({
        ...translation,
        description: translation.description ?? undefined,
      })),
    }))
    return { course, courses, studyModules, tags, defaultValues, tagOptions }
  }, [courseData, coursesData, studyModulesData, tagsData])

  return {
    loading:
      courseLoading || studyModulesLoading || coursesLoading || tagsLoading,
    error: courseError ?? studyModulesError ?? coursesError ?? tagsError,
    addCourse,
    updateCourse,
    deleteCourse,
    mutationLoading:
      addCourseLoading || updateCourseLoading || deleteCourseLoading,
    mutationError: addCourseError ?? updateCourseError ?? deleteCourseError,
    data,
  }
}
