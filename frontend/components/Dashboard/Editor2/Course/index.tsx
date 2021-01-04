import { useForm, FormProvider, SubmitErrorHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { PureQueryOptions, useApolloClient, useMutation } from "@apollo/client"
import {
  AllCoursesQuery,
  AllEditorCoursesQuery,
  CheckSlugQuery,
  CourseEditorCoursesQuery,
} from "/graphql/queries/courses"
import { CourseDetails_course } from "/static/types/generated/CourseDetails"
import courseEditSchema from "/components/Dashboard/Editor/Course/form-validation"
import { useState, useCallback, useEffect } from "react"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import {
  AddCourseMutation,
  UpdateCourseMutation,
  DeleteCourseMutation,
} from "/graphql/mutations/courses"
import { CourseFormValues } from "./types"
import { fromCourseForm, toCourseForm } from "./serialization"
import { CourseQuery } from "/pages/[lng]/courses/[id]/edit"
import notEmpty from "/util/notEmpty"
import { EditorContext } from "../EditorContext"
import flattenKeys from "/util/flattenKeys"
import { useAnchorContext } from "/contexes/AnchorContext"
import { FormStatus } from "/components/Dashboard/Editor2/types"
import CourseEditForm from "./CourseEditForm"
interface CourseEditorProps {
  course: CourseDetails_course
  studyModules?: CourseEditorStudyModules_study_modules[]
}

export default function CourseEditor({
  course,
  studyModules,
}: CourseEditorProps) {
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
    resolver: yupResolver(validationSchema),
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

  const onSubmit = useCallback(async (data: CourseFormValues, _?: any) => {
    const newCourse = !data.id
    const mutationVariables = fromCourseForm({
      values: data,
      initialValues: defaultValues,
    })
    // - if we create a new course, we refetch all courses so the new one is on the list
    // - if we update, we also need to refetch that course with a potentially updated slug
    const refetchQueries = [
      { query: AllCoursesQuery },
      { query: AllEditorCoursesQuery },
      { query: CourseEditorCoursesQuery },
      !newCourse
        ? { query: CourseQuery, variables: { slug: data.new_slug } }
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
    } catch (err) {
      console.log("whoops?", err)
      setStatus({ message: err.message, error: true })
    }
  }, [])

  const onError: SubmitErrorHandler<CourseFormValues> = useCallback(
    (errors: Record<string, any>, _?: any) => {
      const flattenedErrors = flattenKeys(errors)

      const [key, value] = Object.entries(flattenedErrors).sort(
        (a, b) => anchors[a[0]]?.id - anchors[b[0]]?.id,
      )[0]
      const anchor = anchors[key]

      let anchorLink = key
      if (Array.isArray(value)) {
        const firstIndex = parseInt(Object.keys(value)[0])
        anchorLink = `${key}[${firstIndex}].${
          Object.keys(value[firstIndex])[0]
        }`
      }
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
    console.log("would delete", id)
    //await deleteCourse({ variables: { id }})
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
        <CourseEditForm course={course} studyModules={studyModules} />
      </EditorContext.Provider>
    </FormProvider>
  )
}
