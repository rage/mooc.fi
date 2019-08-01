import React, { useCallback } from "react"
import CourseEditForm from "./CourseEditForm"
import { useMutation, useApolloClient } from "react-apollo-hooks"
import {
  AddCourseMutation,
  UpdateCourseMutation,
  DeleteCourseMutation,
  CheckSlugQuery,
} from "./graphql"
import {
  CourseFormValues,
  CourseTranslationFormValues,
  OpenUniversityRegistrationValues,
} from "./types"
import courseEditSchema, { initialValues } from "./form-validation"
import { FormikActions, getIn } from "formik"
import Next18next from "../../../i18n"
import { AllCoursesQuery } from "../../../pages/courses"
import get from "lodash/get"

const isProduction = process.env.NODE_ENV === "production"

const CourseEdit = ({ course }: { course?: CourseFormValues }) => {
  const addCourse = useMutation(AddCourseMutation, {
    refetchQueries: [{ query: AllCoursesQuery }],
  })
  const updateCourse = useMutation(UpdateCourseMutation)
  const deleteCourse = useMutation(DeleteCourseMutation, {
    refetchQueries: [{ query: AllCoursesQuery }],
  })
  const checkSlug = CheckSlugQuery

  const client = useApolloClient()

  const _course: CourseFormValues = course
    ? {
        ...course,
        course_translations: (course.course_translations || []).map(c => ({
          ...c,
          open_university_course_code: get(
            (course.open_university_registration_links || []).find(
              l => l.language === c.language,
            ),
            "course_code",
          ),
        })),
        new_slug: course.slug,
        thumbnail: course.photo ? course.photo.compressed : null,
      }
    : initialValues

  const validationSchema = courseEditSchema({
    client,
    checkSlug,
    initialSlug:
      course && course.slug && course.slug !== "" ? course.slug : null,
  })

  const onSubmit = useCallback(
    async (
      values: CourseFormValues,
      {
        setSubmitting,
        setFieldValue,
        setStatus,
      }: FormikActions<CourseFormValues>,
    ): Promise<void> => {
      const newCourse = !values.id

      const course_translations = values.course_translations.length
        ? values.course_translations.map((c: CourseTranslationFormValues) => ({
            ...c,
            open_university_course_code: undefined,
            id: !c.id || c.id === "" ? null : c.id,
            __typename: undefined,
          }))
        : null

      const open_university_registration_links = values.course_translations
        .length
        ? values.course_translations
            .map((c: CourseTranslationFormValues) => {
              if (
                !c.open_university_course_code ||
                c.open_university_course_code === ""
              ) {
                return null
              }

              const prevLink = (
                _course.open_university_registration_links || []
              ).find(l => l.language === c.language)

              if (!prevLink) {
                return {
                  language: c.language,
                  course_code: c.open_university_course_code.trim(),
                }
              }

              return {
                ...prevLink,
                course_code: c.open_university_course_code.trim(),
                __typename: undefined,
              }
            })
            .filter(v => !!v)
        : null

      const newValues: CourseFormValues = {
        ...values,
        id: undefined,
        slug: values.id ? values.slug : values.new_slug,
        base64: !isProduction,
        photo: getIn(values, "photo.id"),
      }
      const courseMutation = newCourse ? addCourse : updateCourse

      try {
        setStatus({ message: "Saving..." })
        const course = await courseMutation({
          variables: {
            ...newValues,
            course_translations,
            open_university_registration_links,
          },
        })

        setStatus({ message: null })
        // prevent the very rare chance of pressing submit while redirecting
        // setSubmitting(false)
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
    <section>
      <CourseEditForm
        course={_course}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    </section>
  )
}

export default CourseEdit
