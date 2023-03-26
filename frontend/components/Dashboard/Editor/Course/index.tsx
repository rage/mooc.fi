import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useRouter } from "next/router"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"

import {
  useApolloClient,
  useMutation,
  type PureQueryOptions,
} from "@apollo/client"
import { yupResolver } from "@hookform/resolvers/yup"

import EditorContainer from "../EditorContainer"
import CourseEditForm from "./CourseEditForm"
import courseEditSchema from "./form-validation"
import { fromCourseForm } from "./serialization"
import { CourseFormValues } from "./types"
import {
  EditorContextProvider,
  useAnchors,
  useEditorData,
} from "/components/Dashboard/Editor/EditorContext"
import { useSnackbarMethods } from "/contexts/SnackbarContext"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"

import {
  AddCourseDocument,
  CourseEditorOtherCoursesDocument,
  CourseFromSlugDocument,
  CoursesDocument,
  CourseUpsertArg,
  DeleteCourseDocument,
  EditorCoursesDocument,
  UpdateCourseDocument,
} from "/graphql/generated"

const anchors = {}

function CourseEditor() {
  const render = useRef(0)
  const { course, defaultValues } = useEditorData()
  const t = useTranslator(CoursesTranslations)
  const [tab, setTab] = useState(0)
  const { addAnchor, scrollFirstErrorIntoView } = useAnchors(anchors)
  const client = useApolloClient()
  const { locale } = useRouter()

  const { addSnackbar } = useSnackbarMethods()

  useEffect(() => {
    render.current++
  })
  const validationSchema = useMemo(
    () =>
      courseEditSchema({
        client,
        initialSlug: course?.slug && course.slug !== "" ? course.slug : null,
        t,
      }),
    [course, client, t, locale],
  )
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema), //useCustomValidationResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldFocusError: false,
    shouldUnregister: false,
    // reValidateMode: "onChange"
  })
  const { trigger } = methods

  useEffect(() => {
    // validate on load
    trigger()
    /*reset(
      {},
      {
        keepValues: true,
        keepErrors: true,
        keepDirty: false,
        keepDefaultValues: true,
      },
    )*/
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

  const onSubmit = useCallback(async (values: CourseFormValues) => {
    const isNewCourse = !values.id

    const mutationVariables = fromCourseForm({
      values,
      initialValues: defaultValues,
    })
    // - if we create a new course, we refetch all courses so the new one is on the list
    // - if we update, we also need to refetch that course with a potentially updated slug
    const refetchQueries: PureQueryOptions[] = [
      { query: CoursesDocument },
      { query: EditorCoursesDocument },
      { query: CourseEditorOtherCoursesDocument },
    ]

    if (!isNewCourse) {
      refetchQueries.push({
        query: CourseFromSlugDocument,
        variables: { slug: values.new_slug },
      })
    }

    try {
      addSnackbar({ message: t("statusSaving") })

      if (isNewCourse) {
        await addCourse({
          variables: { course: mutationVariables },
          refetchQueries: () => refetchQueries,
          onCompleted: () => {
            addSnackbar({
              message: t("statusSavingSuccess"),
              severity: "success",
            })
          },
        })
      } else {
        await updateCourse({
          variables: { course: mutationVariables as CourseUpsertArg },
          refetchQueries: () => refetchQueries,
        })
      }
      console.log("setting save success")
      addSnackbar({ message: t("statusSavingSuccess"), severity: "success" })
    } catch (err: any) {
      console.error("error saving", JSON.stringify(err.message, null, 2))
      addSnackbar({ message: t("statusSavingError"), severity: "error" })
    }
  }, [])

  const onError: SubmitErrorHandler<CourseFormValues> = (errors) => {
    addSnackbar({ message: t("statusValidationErrors"), severity: "warning" })
    scrollFirstErrorIntoView(errors, tab, setTab)
  }

  const onCancel = useCallback(() => console.log("cancelled"), [])
  const onDelete = useCallback(async (id: string) => {
    await deleteCourse({ variables: { id } })
  }, [])

  const editorContextValue = useMemo(
    () => ({
      tab,
      initialValues: defaultValues,
      anchors,
    }),
    [tab, defaultValues],
  )
  const editorMethodContextValue = useMemo(
    () => ({
      setTab,
      onSubmit,
      onError,
      onCancel,
      onDelete,
      addAnchor,
      scrollFirstErrorIntoView,
    }),
    [],
  )

  return (
    <FormProvider {...methods}>
      <EditorContextProvider
        value={editorContextValue}
        methods={editorMethodContextValue}
      >
        <p>{render.current}</p>
        <EditorContainer<CourseFormValues>>
          <CourseEditForm />
        </EditorContainer>
      </EditorContextProvider>
    </FormProvider>
  )
}

export default CourseEditor
