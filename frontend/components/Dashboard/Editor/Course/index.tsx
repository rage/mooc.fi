import React, { useCallback } from "react"
import CourseEditForm from "./CourseEditForm"
import { useMutation, useApolloClient } from "react-apollo-hooks"
import {
  AddCourseMutation,
  UpdateCourseMutation,
  DeleteCourseMutation,
  CheckSlugQuery,
} from "./graphql"
import { CourseFormValues, CourseTranslationFormValues } from "./types"
import courseEditSchema, { initialValues } from "./form-validation"
import { FormikActions, getIn } from "formik"
import Next18next from "/i18n"
import { AllCoursesQuery } from "/pages/courses"
import get from "lodash/get"
import {
  CourseDetails_course_photo,
  CourseDetails_course,
  CourseDetails_course_open_university_registration_links,
} from "/static/types/generated/CourseDetails"
import { StudyModules_study_modules } from "/static/types/StudyModules"
import { CourseStatus } from "/static/types/globalTypes"
import { CourseQuery } from "/pages/courses/[id]/edit"
import { FetchResult, PureQueryOptions } from "apollo-boost"

const isProduction = process.env.NODE_ENV === "production"

const CourseEdit = ({
  course,
  modules,
}: {
  course?: CourseDetails_course
  modules?: StudyModules_study_modules[]
}) => {
  const addCourse = useMutation(AddCourseMutation, {
    refetchQueries: [{ query: AllCoursesQuery }],
  })
  const updateCourse = useMutation(UpdateCourseMutation, {
    refetchQueries: [
      { query: AllCoursesQuery },
      /*       {
        query: CourseQuery,
        variables: course ? { slug: course!.slug } : undefined,
      } */
    ],
  })
  const deleteCourse = useMutation(DeleteCourseMutation, {
    refetchQueries: [{ query: AllCoursesQuery }],
  })
  const checkSlug = CheckSlugQuery

  const client = useApolloClient()

  // TODO: (de)normalization to somewhere else
  const courseStudyModules = course
    ? (course.study_modules || []).map(module => module.id)
    : []

  const _course: CourseFormValues = course
    ? {
        ...course,
        start_point: course.start_point || false,
        promote: course.promote || false,
        hidden: course.hidden || false,
        order: course.order || undefined,
        status: course.status || CourseStatus.Upcoming,
        course_translations: (course.course_translations || []).map(c => ({
          ...c,
          open_university_course_code: get(
            (course.open_university_registration_links || []).find(
              (l: CourseDetails_course_open_university_registration_links) =>
                l.language === c.language,
            ),
            "course_code",
          ),
        })),
        study_modules: modules
          ? modules.reduce(
              (acc, module) => ({
                ...acc,
                [module.id]: courseStudyModules.includes(module.id),
              }),
              {},
            )
          : null,
        new_slug: course.slug,
        thumbnail: course.photo
          ? (course.photo as CourseDetails_course_photo).compressed
          : null,
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
      { setSubmitting, setStatus }: FormikActions<CourseFormValues>,
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
                  language: c.language || "",
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

      const study_modules = Object.keys(values.study_modules || {}).filter(
        key => (values.study_modules || {})[key],
      )

      const newValues: CourseFormValues = {
        ...values,
        id: undefined,
        slug: values.id ? values.slug : values.new_slug,
        base64: !isProduction,
        photo: getIn(values, "photo.id"),
        // despite order being a number in the typings, it comes back as an empty string without TS yelling at you
        // @ts-ignore
        order: values.order === "" ? null : values.order,
      }

      const courseMutation = newCourse ? addCourse : updateCourse

      try {
        setStatus({ message: "Saving..." })

        // - if we create a new course, we refetch all courses so the new one is on the list
        // - if we update, we also need to refetch that course with a potentially updated slug
        const refetchQueries = [
          { query: AllCoursesQuery },
          values.id
            ? { query: CourseQuery, variables: { slug: values.new_slug } }
            : undefined,
        ].filter(v => !!v) as PureQueryOptions[]

        // TODO/FIXME: return value?
        await courseMutation({
          variables: {
            ...newValues,
            course_translations,
            open_university_registration_links,
            study_modules,
          },
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
      course={_course}
      studyModules={modules}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}

export default CourseEdit
