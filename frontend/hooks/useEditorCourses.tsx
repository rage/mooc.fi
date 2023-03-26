import { useMutation, useQuery } from "@apollo/client"

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
    courseData,
    studyModulesData,
    coursesData,
    tagsData,
  }
}
