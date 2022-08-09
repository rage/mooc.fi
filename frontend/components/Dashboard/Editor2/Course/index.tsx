import { useCallback, useEffect, useState } from "react"

import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"

import { PureQueryOptions, useApolloClient, useMutation } from "@apollo/client"

import { EditorContext } from "../EditorContext"
import CourseEditForm from "./CourseEditForm"
import { fromCourseForm, toCourseForm } from "./serialization"
import { CourseFormValues } from "./types"
import { customValidationResolver } from "/components/Dashboard/Editor2/Common"
import courseEditSchema from "/components/Dashboard/Editor2/Course/form-validation"
import { FormStatus } from "/components/Dashboard/Editor2/types"
import { useAnchorContext } from "/contexts/AnchorContext"
import withEnumeratingAnchors from "/lib/with-enumerating-anchors"
import CoursesTranslations from "/translations/courses"
import notEmpty from "/util/notEmpty"
import { getFirstErrorAnchor } from "/util/useEnumeratingAnchors"
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
  StudyModuleDetailedFieldsFragment,
  UpdateCourseDocument,
} from "/static/types/generated"

interface CourseEditProps {
  course?: EditorCourseDetailedFieldsFragment
  courses?: EditorCourseOtherCoursesFieldsFragment[]
  studyModules?: StudyModuleDetailedFieldsFragment[]
}

function CourseEditor({ course, courses, studyModules }: CourseEditProps) {
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

  const [addCourse] = useMutation(AddCourseDocument)
  const [updateCourse] = useMutation(UpdateCourseDocument)
  const [deleteCourse] = useMutation(DeleteCourseDocument, {
    refetchQueries: [
      { query: CoursesDocument },
      { query: EditorCoursesDocument },
      { query: CourseEditorOtherCoursesDocument },
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
      { query: CoursesDocument },
      { query: EditorCoursesDocument },
      { query: CourseEditorOtherCoursesDocument },
      !newCourse
        ? {
            query: CourseFromSlugDocument,
            variables: { slug: values.new_slug },
          }
        : undefined,
    ].filter(notEmpty) as PureQueryOptions[]

    console.log("would mutate", mutationVariables)
    try {
      setStatus({ message: t("statusSaving") })

      console.log("trying to save")
      if (newCourse) {
        await addCourse({
          variables: { course: mutationVariables },
          refetchQueries: () => refetchQueries,
        })
      } else {
        await updateCourse({
          variables: { course: mutationVariables as CourseUpsertArg },
          refetchQueries: () => refetchQueries,
        })
      }
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
