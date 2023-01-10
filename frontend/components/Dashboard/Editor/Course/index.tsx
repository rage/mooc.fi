import { useCallback } from "react"

import { FormikHelpers } from "formik"
import Router from "next/router"

import {
  useApolloClient,
  useMutation,
  type PureQueryOptions,
} from "@apollo/client"

import CourseEditForm from "./CourseEditForm"
import courseEditSchema from "./form-validation"
import { fromCourseForm, toCourseForm } from "./serialization"
import { CourseFormValues } from "./types"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

import {
  AddCourseDocument,
  CourseEditorOtherCoursesDocument,
  CourseFromSlugDocument,
  CoursesDocument,
  CourseUpsertArg,
  DeleteCourseDocument,
  EditorCourseDetailedFieldsFragment,
  EditorCourseOtherCoursesFieldsFragment,
  EditorCoursesDocument,
  EmailTemplateEditorCoursesDocument,
  StudyModuleDetailedFieldsFragment,
  UpdateCourseDocument,
} from "/graphql/generated"

interface CourseEditProps {
  course?: EditorCourseDetailedFieldsFragment
  courses?: EditorCourseOtherCoursesFieldsFragment[] | null
  modules?: StudyModuleDetailedFieldsFragment[] | null
}

const CourseEdit = ({ course, modules, courses }: CourseEditProps) => {
  const t = useTranslator(CoursesTranslations)

  const [addCourse] = useMutation(AddCourseDocument)
  const [updateCourse] = useMutation(UpdateCourseDocument)
  const [deleteCourse] = useMutation(DeleteCourseDocument, {
    refetchQueries: [
      { query: CoursesDocument },
      { query: EditorCoursesDocument },
      { query: CourseEditorOtherCoursesDocument },
      { query: EmailTemplateEditorCoursesDocument },
    ],
  })

  const client = useApolloClient()

  const initialValues = toCourseForm({ course, modules })

  const validationSchema = courseEditSchema({
    client,
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
        { query: CoursesDocument },
        { query: EditorCoursesDocument },
        { query: CourseEditorOtherCoursesDocument },
        { query: EmailTemplateEditorCoursesDocument },
        !newCourse
          ? {
              query: CourseFromSlugDocument,
              variables: { slug: values.new_slug },
            }
          : undefined,
      ].filter((v) => !!v) as PureQueryOptions[]

      try {
        setStatus({ message: t("statusSaving") })

        // TODO/FIXME: return value?
        if (newCourse) {
          await addCourse({
            variables: {
              course: mutationVariables,
            },
            refetchQueries: () => refetchQueries,
          })
        } else {
          await updateCourse({
            variables: {
              course: mutationVariables as CourseUpsertArg,
            },
            refetchQueries: () => refetchQueries,
          })
        }

        setStatus({ message: null })
        Router.push(`/courses`, undefined, { shallow: true })
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
      Router.push(`/courses`, undefined, { shallow: true })
    }
  }, [])

  const onCancel = useCallback(() => {
    Router.push(`/courses`, undefined, { shallow: true })
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
