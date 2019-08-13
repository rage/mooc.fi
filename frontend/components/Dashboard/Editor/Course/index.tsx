import React, { useCallback } from "react"
import CourseEditForm from "./CourseEditForm"
import { useMutation, useApolloClient } from "@apollo/react-hooks"
import {
  AddCourseMutation,
  UpdateCourseMutation,
  DeleteCourseMutation,
  CheckSlugQuery,
} from "./graphql"
import { CourseFormValues } from "./types"
import courseEditSchema from "./form-validation"
import { FormikActions } from "formik"
import NextI18Next from "/i18n"
import { AllCoursesQuery } from "/pages/courses"
import { CourseDetails_course } from "/static/types/generated/CourseDetails"
import { StudyModules_study_modules } from "/static/types/StudyModules"
import { CourseQuery } from "/pages/courses/[id]/edit"
import { FetchResult, PureQueryOptions } from "apollo-boost"
import { toCourseForm, fromCourseForm } from "./serialization"

const CourseEdit = ({
  course,
  modules,
}: {
  course?: CourseDetails_course
  modules?: StudyModules_study_modules[]
}) => {
  const [addCourse] = useMutation(AddCourseMutation)
  const [updateCourse] = useMutation(UpdateCourseMutation)
  const [deleteCourse] = useMutation(DeleteCourseMutation, {
    refetchQueries: [{ query: AllCoursesQuery }],
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
        NextI18Next.Router.push("/courses")
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
      NextI18Next.Router.push("/courses")
    }
  }, [])

  const onCancel = useCallback(() => {
    NextI18Next.Router.push("/courses")
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
