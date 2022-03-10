import { useCallback, useEffect, useState } from "react"

import { customValidationResolver } from "/components/Dashboard/Editor2/Common"
import courseEditSchema from "/components/Dashboard/Editor2/Course/form-validation"
import { FormStatus } from "/components/Dashboard/Editor2/types"
import { useAnchorContext } from "/contexts/AnchorContext"
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
import withEnumeratingAnchors from "/lib/with-enumerating-anchors"
import { CourseDetails_course } from "/static/types/generated/CourseDetails"
import { CourseEditorCourses_courses } from "/static/types/generated/CourseEditorCourses"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import CoursesTranslations from "/translations/courses"
import notEmpty from "/util/notEmpty"
import { getFirstErrorAnchor } from "/util/useEnumeratingAnchors"
import { useTranslator } from "/util/useTranslator"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"

import { PureQueryOptions, useApolloClient, useMutation } from "@apollo/client"

import { EditorContext } from "../EditorContext"
import CourseEditForm from "./CourseEditForm"
import { fromCourseForm, toCourseForm } from "./serialization"
import { CourseFormValues } from "./types"

interface CourseEditorProps {
  course?: CourseDetails_course
  courses?: CourseEditorCourses_courses[]
  studyModules?: CourseEditorStudyModules_study_modules[]
}

function CourseEditor({ course, courses, studyModules }: CourseEditorProps) {
  const t = useTranslator(CoursesTranslations)
  const [status, setStatus] = useState<FormStatus>({ message: null })
  const [tab, setTab] = useState(0)
  const { anchors } = useAnchorContext()
  const client = useApolloClient()

  const defaultValues = toCourseForm({
    course,
    modules: studyModules,
  })
  const validationSchema = courseEditSchema({
    client,
    checkSlug: CheckSlugQuery,
    initialSlug: course?.slug && course.slug !== "" ? course.slug : null,
    t,
  })
  const methods = useForm<CourseFormValues>({
    defaultValues,
    resolver: customValidationResolver(validationSchema),
    mode: "onBlur",
    //reValidateMode: "onChange"
  })
  const { trigger } = methods

  useEffect(() => {
    // validate on load
    trigger()
  }, [])

  const [addCourse] = useMutation(AddCourseMutation)
  const [updateCourse] = useMutation(UpdateCourseMutation)
  const [deleteCourse] = useMutation(DeleteCourseMutation, {
    refetchQueries: [
      { query: AllCoursesQuery },
      { query: AllEditorCoursesQuery },
      { query: CourseEditorCoursesQuery },
    ],
  })

  const onSubmit = useCallback(async (values: CourseFormValues, _?: any) => {
    const newCourse = !values.id
    const mutationVariables = fromCourseForm({
      values,
      initialValues: defaultValues,
    })
    // - if we create a new course, we refetch all courses so the new one is on the list
    // - if we update, we also need to refetch that course with a potentially updated slug
    const refetchQueries = [
      { query: AllCoursesQuery },
      { query: AllEditorCoursesQuery },
      { query: CourseEditorCoursesQuery },
      !newCourse
        ? { query: CourseQuery, variables: { slug: values.new_slug } }
        : undefined,
    ].filter(notEmpty) as PureQueryOptions[]

    const courseMutation = newCourse ? addCourse : updateCourse

    console.log("would mutate", mutationVariables)
    try {
      setStatus({ message: t("statusSaving") })

      console.log("trying to save")
      await courseMutation({
        variables: { course: mutationVariables },
        refetchQueries: () => refetchQueries,
      })
      setStatus({ message: null })
    } catch (err: any) {
      setStatus({ message: err.message, error: true })
    }
  }, [])

  const onError: SubmitErrorHandler<CourseFormValues> = useCallback(
    (errors: Record<string, any>, _?: any) => {
      const { anchor, anchorLink } = getFirstErrorAnchor(anchors, errors)

      setTab(anchor?.tab ?? 0)

      setTimeout(() => {
        const element = document.getElementById(anchorLink)
        element?.scrollIntoView()
      }, 100)
    },
    [],
  )

  const onCancel = useCallback(() => console.log("cancelled"), [])
  const onDelete = useCallback(async (id: string) => {
    await deleteCourse({ variables: { id } })
  }, [])

  return (
    <FormProvider {...methods}>
      <EditorContext.Provider
        value={{
          status,
          setStatus,
          tab,
          setTab,
          onSubmit,
          onError,
          onCancel,
          onDelete,
          initialValues: defaultValues,
        }}
      >
        <CourseEditForm
          course={course}
          courses={courses}
          studyModules={studyModules}
        />
      </EditorContext.Provider>
    </FormProvider>
  )
}

export default withEnumeratingAnchors(CourseEditor)
