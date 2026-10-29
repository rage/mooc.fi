import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useRouter } from "next/router"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"

import {
  useApolloClient,
  useMutation,
  type PureQueryOptions,
} from "@apollo/client"
import { yupResolver } from "@hookform/resolvers/yup"
import { useEventCallback } from "@mui/material/utils"

import EditorContainer from "../EditorContainer"
import CourseEditForm from "./CourseEditForm"
import { useCourseEditorData } from "./CourseEditorDataContext"
import courseEditSchema, { CourseEditSchemaType } from "./form-validation"
import { fromCourseForm, toCourseForm } from "./serialization"
import { CourseFormValues } from "./types"
import { EditorContextProvider } from "/components/Dashboard/Editor/EditorContext"
import { useSnackbarMethods } from "/contexts/SnackbarContext"
import { useAnchors } from "/hooks/useAnchors"
import useIsOld from "/hooks/useIsOld"
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
  const { course, defaultValues, isClone } = useCourseEditorData()
  const t = useTranslator(CoursesTranslations, CommonTranslations)
  const [tab, setTab] = useState(0)
  const { addAnchor, scrollFirstErrorIntoView } = useAnchors(anchors)
  const client = useApolloClient()
  const router = useRouter()
  const { locale } = router
  const baseUrl = useIsOld() ? "/_old" : "/admin"
  const [redirectSlug, setRedirectSlug] = useState<string>()
  const savedValues = useRef(defaultValues)

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
    resolver: yupResolver<CourseEditSchemaType>(validationSchema), //useCustomValidationResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldFocusError: false,
    shouldUnregister: false,
  })
  const { trigger, reset } = methods

  useEffect(() => {
    if (course?.id && !isClone) {
      trigger()
    }
  }, [])

  useEffect(() => {
    if (redirectSlug) {
      router.push(`${baseUrl}/courses/${redirectSlug}/edit`)
    }
  }, [redirectSlug])

  const [addCourse] = useMutation(AddCourseDocument)
  const [updateCourse] = useMutation(UpdateCourseDocument)
  const [deleteCourse] = useMutation(DeleteCourseDocument, {
    refetchQueries: [
      { query: CoursesDocument },
      { query: EditorCoursesDocument },
      { query: CourseEditorOtherCoursesDocument },
    ],
  })

  const onSubmit = useCallback(
    async (values: CourseFormValues) => {
      const isNewCourse = !values.id

      const mutationVariables = fromCourseForm({
        values,
        defaultValues: savedValues.current,
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
          const { data } = await addCourse({
            variables: { course: mutationVariables },
            refetchQueries: () => refetchQueries,
          })

          reset(values)
          setRedirectSlug(data?.addCourse?.slug ?? values.new_slug)
        } else {
          const { data } = await updateCourse({
            variables: { course: mutationVariables as CourseUpsertArg },
            refetchQueries: () => refetchQueries,
          })

          if (data?.updateCourse) {
            const saved = toCourseForm({ course: data.updateCourse })

            savedValues.current = saved
            reset(saved)
          }
          if (values.new_slug !== values.slug) {
            setRedirectSlug(values.new_slug)
          }
        }
        addSnackbar({ message: t("statusSavingSuccess"), severity: "success" })
      } catch (err: any) {
        console.error("error saving", JSON.stringify(err.message, null, 2))
        addSnackbar({
          message: `${t("statusSavingError")}: ${err.message}`,
          severity: "error",
        })
      }
    },
    [t],
  )

  const onError: SubmitErrorHandler<CourseFormValues> = useCallback(
    (errors) => {
      addSnackbar({ message: t("statusValidationErrors"), severity: "warning" })
      scrollFirstErrorIntoView({ errors, tab, setTab })
    },
    [t, tab, setTab],
  )

  const onCancel = useEventCallback(() => {
    router.push("/courses", undefined, { shallow: true })
  })

  const onDelete = useCallback(async (id: string) => {
    await deleteCourse({ variables: { id } })
  }, [])

  const editorContextValue = useMemo(
    () => ({
      tab,
      anchors,
      isClone,
    }),
    [tab, anchors, isClone],
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
        <EditorContainer>
          <CourseEditForm />
        </EditorContainer>
      </EditorContextProvider>
    </FormProvider>
  )
}

export default CourseEditor
