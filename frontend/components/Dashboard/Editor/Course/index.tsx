import React, { useCallback, useContext } from "react"
import CourseEditForm from "./CourseEditForm"
import { useMutation, useApolloClient } from "@apollo/react-hooks"
import { CourseFormValues } from "./types"
import courseEditSchema from "./form-validation"
import { FormikActions } from "formik"
import {
  AllCoursesQuery,
  AllEditorCoursesQuery,
  CheckSlugQuery,
} from "/graphql/queries/courses"
import {
  AddCourseMutation,
  UpdateCourseMutation,
  DeleteCourseMutation,
} from "/graphql/mutations/courses"
import { CourseDetails_course } from "/static/types/generated/CourseDetails"
import { StudyModules_study_modules } from "/static/types/StudyModules"
import { CourseQuery } from "/pages/[lng]/courses/[id]/edit"
import { FetchResult, PureQueryOptions } from "apollo-boost"
import { toCourseForm, fromCourseForm } from "./serialization"
import Router from "next/router"
import LanguageContext from "/contexes/LanguageContext"

const CourseEdit = ({
  course,
  modules,
}: {
  course?: CourseDetails_course
  modules?: StudyModules_study_modules[]
}) => {
  const { language } = useContext(LanguageContext)

  const [addCourse] = useMutation(AddCourseMutation)
  const [updateCourse] = useMutation(UpdateCourseMutation)
  const [deleteCourse] = useMutation(DeleteCourseMutation, {
    refetchQueries: [
      { query: AllCoursesQuery },
      { query: AllEditorCoursesQuery },
    ],
  })
  const checkSlug = CheckSlugQuery

  const client = useApolloClient()

  const initialValues = toCourseForm({ course, modules })

  const validationSchema = courseEditSchema({
    client,
    checkSlug,
    initialSlug:
      course && course.slug && course.slug !== "" ? course.slug : null,
  })

  const onSubmit = useCallback(
    async (
      values: CourseFormValues,
      { setSubmitting, setStatus }: FormikActions<CourseFormValues>,
    ): Promise<void> => {
      const newCourse = !values.id

      const mutationVariables = fromCourseForm({ values, initialValues })
      // - if we create a new course, we refetch all courses so the new one is on the list
      // - if we update, we also need to refetch that course with a potentially updated slug
      const refetchQueries = [
        { query: AllCoursesQuery },
        { query: AllEditorCoursesQuery },
        !newCourse
          ? { query: CourseQuery, variables: { slug: values.new_slug } }
          : undefined,
      ].filter(v => !!v) as PureQueryOptions[]

      const courseMutation = newCourse ? addCourse : updateCourse

      try {
        setStatus({ message: "Saving..." })

        // TODO/FIXME: return value?
        await courseMutation({
          variables: mutationVariables,
          // @ts-ignore
          refetchQueries: (result: FetchResult) => refetchQueries,
        })

        setStatus({ message: null })
        Router.push(`/${language}/courses`)
      } catch (err) {
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
      Router.push(`/${language}/courses`)
    }
  }, [])

  const onCancel = useCallback(() => {
    Router.push(`/${language}/courses`)
  }, [])

  return (
    <CourseEditForm
      course={initialValues}
      studyModules={modules}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}

export default CourseEdit
