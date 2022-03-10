import { useCallback, useContext } from "react"

import LanguageContext from "/contexts/LanguageContext"
import {
  AddCourseMutation,
  DeleteCourseMutation,
  UpdateCourseMutation,
} from "/graphql/mutations/courses"
import {
  AllCoursesQuery,
  AllEditorCoursesQuery,
  CheckSlugQuery,
  CourseEditorCoursesQuery,
  CourseQuery,
} from "/graphql/queries/courses"
import { CourseDetails_course } from "/static/types/generated/CourseDetails"
import { CourseEditorCourses_courses } from "/static/types/generated/CourseEditorCourses"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import { FormikHelpers } from "formik"
import Router from "next/router"

import { PureQueryOptions, useApolloClient, useMutation } from "@apollo/client"

import CourseEditForm from "./CourseEditForm"
import courseEditSchema from "./form-validation"
import { fromCourseForm, toCourseForm } from "./serialization"
import { CourseFormValues } from "./types"

const CourseEdit = ({
  course,
  modules,
  courses,
}: {
  course?: CourseDetails_course
  modules?: CourseEditorStudyModules_study_modules[]
  courses?: CourseEditorCourses_courses[]
}) => {
  const { language } = useContext(LanguageContext)
  const t = useTranslator(CoursesTranslations)

  const [addCourse] = useMutation(AddCourseMutation)
  const [updateCourse] = useMutation(UpdateCourseMutation)
  const [deleteCourse] = useMutation(DeleteCourseMutation, {
    refetchQueries: [
      { query: AllCoursesQuery },
      { query: AllEditorCoursesQuery },
      { query: CourseEditorCoursesQuery },
    ],
  })
  const checkSlug = CheckSlugQuery

  const client = useApolloClient()

  const initialValues = toCourseForm({ course, modules })

  const validationSchema = courseEditSchema({
    client,
    checkSlug,
    initialSlug: course?.slug && course.slug !== "" ? course.slug : null,
    t,
  })

  const onSubmit = useCallback(
    async (
      values: CourseFormValues,
      { setSubmitting, setStatus }: FormikHelpers<CourseFormValues>,
    ): Promise<void> => {
      const newCourse = !values.id

      const mutationVariables = fromCourseForm({ values, initialValues })
      // - if we create a new course, we refetch all courses so the new one is on the list
      // - if we update, we also need to refetch that course with a potentially updated slug
      const refetchQueries = [
        { query: AllCoursesQuery },
        { query: AllEditorCoursesQuery },
        { query: CourseEditorCoursesQuery },
        !newCourse
          ? { query: CourseQuery, variables: { slug: values.new_slug } }
          : undefined,
      ].filter((v) => !!v) as PureQueryOptions[]

      const courseMutation = newCourse ? addCourse : updateCourse

      try {
        setStatus({ message: t("statusSaving") })

        // TODO/FIXME: return value?
        await courseMutation({
          variables: { course: mutationVariables },
          refetchQueries: () => refetchQueries,
        })

        setStatus({ message: null })
        Router.push(`/${language}/courses`, undefined, { shallow: true })
      } catch (err: any) {
        setStatus({ message: err.message, error: true })
        console.error(err)
        setSubmitting(false)
      }
    },
    [],
  )

  const onDelete = useCallback(async (values: CourseFormValues) => {
    if (values.id) {
      await deleteCourse({ variables: { id: values.id } })
      Router.push(`/${language}/courses`, undefined, { shallow: true })
    }
  }, [])

  const onCancel = useCallback(() => {
    Router.push(`/${language}/courses`, undefined, { shallow: true })
  }, [])

  return (
    <CourseEditForm
      course={initialValues}
      studyModules={modules}
      courses={courses}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}

export default CourseEdit
