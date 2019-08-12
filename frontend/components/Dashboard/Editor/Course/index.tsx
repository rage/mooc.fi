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
import Next18next from "/i18n"
import { AllCoursesQuery } from "/pages/courses"
import { CourseDetails_course } from "/static/types/generated/CourseDetails"
import { StudyModules_study_modules } from "/static/types/StudyModules"
import { CourseQuery } from "/pages/courses/[id]/edit"
import { FetchResult, PureQueryOptions } from "apollo-boost"
import { toCourseForm, fromCourseForm } from "./serialization"
import { addCourse_addCourse } from "/static/types/generated/addCourse"
import { updateCourse_updateCourse } from "/static/types/generated/updateCourse"
import { deleteCourse_deleteCourse } from "/static/types/generated/deleteCourse"

const CourseEdit = ({
  course,
  modules,
}: {
  course?: CourseDetails_course
  modules?: StudyModules_study_modules[]
}) => {
  // FIXME: (?) apollo client hooks migration broke typings, so they're any for now
  const addCourse: any = useMutation<addCourse_addCourse>(AddCourseMutation)
  const updateCourse: any = useMutation<updateCourse_updateCourse>(
    UpdateCourseMutation,
  )
  const deleteCourse: any = useMutation<deleteCourse_deleteCourse>(
    DeleteCourseMutation,
    {
      refetchQueries: [{ query: AllCoursesQuery }],
    },
  )
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
        Next18next.Router.push("/courses")
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
      Next18next.Router.push("/courses")
    }
  }, [])

  const onCancel = useCallback(() => {
    Next18next.Router.push("/courses")
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
