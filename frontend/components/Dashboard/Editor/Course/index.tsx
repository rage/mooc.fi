import { useCallback, useContext } from "react"
import CourseEditForm from "./CourseEditForm"
import { useMutation, useApolloClient } from "@apollo/client"
import { CourseFormValues } from "./types"
import courseEditSchema from "./form-validation"
import { FormikHelpers } from "formik"
import {
  AllCoursesQuery,
  AllEditorCoursesQuery,
  CheckSlugQuery,
  CourseEditorCoursesQuery,
} from "/graphql/queries/courses"
import {
  AddCourseMutation,
  UpdateCourseMutation,
  DeleteCourseMutation,
} from "/graphql/mutations/courses"
import { CourseDetails_course } from "/static/types/generated/CourseDetails"
import { CourseQuery } from "/pages/[lng]/courses/[id]/edit"
import { PureQueryOptions } from "@apollo/client"
import { toCourseForm, fromCourseForm } from "./serialization"
import Router from "next/router"
import LanguageContext from "/contexes/LanguageContext"
import CoursesTranslations from "/translations/courses"
import { CourseEditorCourses_courses } from "/static/types/generated/CourseEditorCourses"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import { useTranslator } from "/util/useTranslator"

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
        Router.push("/[lng]/courses", `/${language}/courses`, { shallow: true })
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
      Router.push("/[lng]/courses", `/${language}/courses`, { shallow: true })
    }
  }, [])

  const onCancel = useCallback(() => {
    Router.push("/[lng]/courses", `/${language}/courses`, { shallow: true })
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
