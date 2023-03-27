import React, { useCallback, useEffect, useMemo, useState } from "react"

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
import { useCourseEditorData } from "./CourseEditorDataContext"
import courseEditSchema from "./form-validation"
import { fromCourseForm } from "./serialization"
import { CourseFormValues } from "./types"
import {
  EditorContextProvider,
  useAnchors,
} from "/components/Dashboard/Editor/EditorContext"
import { useSnackbarMethods } from "/contexts/SnackbarContext"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
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
  const { course, defaultValues } = useCourseEditorData()
  const t = useTranslator(CoursesTranslations, CommonTranslations)
  const [tab, setTab] = useState(0)
  const { addAnchor, scrollFirstErrorIntoView } = useAnchors(anchors)
  const client = useApolloClient()
  const { locale } = useRouter()

  const { addSnackbar } = useSnackbarMethods()

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
      defaultValues,
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
        })
      } else {
        await updateCourse({
          variables: { course: mutationVariables as CourseUpsertArg },
          refetchQueries: () => refetchQueries,
        })
      }
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
      anchors,
    }),
    [tab, anchors],
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
        <EditorContainer<CourseFormValues>>
          <CourseEditForm />
        </EditorContainer>
      </EditorContextProvider>
    </FormProvider>
  )
}

export default CourseEditor
