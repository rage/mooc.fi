import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import Router from "next/router"
import {
  FormProvider,
  Resolver,
  SubmitErrorHandler,
  useForm,
} from "react-hook-form"

import { ApolloClient } from "@apollo/client"
import { useApolloClient, useMutation } from "@apollo/client/react"
import { yupResolver } from "@hookform/resolvers/yup"

import { useResetAfterSubmit } from "../Common"
import EditorContainer from "../EditorContainer"
import { EditorContextProvider } from "../EditorContext"
import studyModuleEditSchema from "./form-validation"
import { fromStudyModuleForm, toStudyModuleForm } from "./serialization"
import StudyModuleEditForm from "./StudyModuleEditForm"
import { StudyModuleFormValues } from "./types"
import { useSnackbarMethods } from "/contexts/SnackbarContext"
import { useAnchors } from "/hooks/useAnchors"
import useIsOld from "/hooks/useIsOld"
import { useTranslator } from "/hooks/useTranslator"
import withEnumeratingAnchors from "/lib/with-enumerating-anchors"
import CommonTranslations from "/translations/common"
import StudyModulesTranslations from "/translations/study-modules"

import {
  AddStudyModuleDocument,
  DeleteStudyModuleDocument,
  EditorStudyModuleDetailsDocument,
  EditorStudyModulesDocument,
  StudyModuleDetailedFieldsFragment,
  StudyModuleExistsDocument,
  StudyModulesDocument,
  UpdateStudyModuleDocument,
} from "/graphql/generated"

interface StudyModuleEditProps {
  module?: StudyModuleDetailedFieldsFragment
}

const anchors = {}

const StudyModuleEdit = ({ module }: StudyModuleEditProps) => {
  const t = useTranslator(StudyModulesTranslations, CommonTranslations)
  const client = useApolloClient()
  const { addAnchor, scrollFirstErrorIntoView } = useAnchors(anchors)
  const { addSnackbar } = useSnackbarMethods()
  const baseUrl = useIsOld() ? "/_old" : "/admin"

  const defaultValues = useRef(toStudyModuleForm({ module }))
  const validationSchema = useMemo(
    () =>
      studyModuleEditSchema({
        client,
        initialSlug: module?.slug && module.slug !== "" ? module.slug : null,
        t,
      }),
    [client, module, t],
  )

  const methods = useForm<StudyModuleFormValues>({
    defaultValues: defaultValues.current,
    // the schema validates only part of the form values
    resolver: yupResolver(
      validationSchema,
    ) as unknown as Resolver<StudyModuleFormValues>, // useCustomValidationResolver(validationSchema),
    mode: "onBlur",
  })
  const { trigger } = methods
  const resetAfterSubmit = useResetAfterSubmit(methods)
  const { isDirty } = methods.formState

  useEffect(() => {
    if (module?.id) {
      trigger()
    }
  }, [])

  const [redirectSlug, setRedirectSlug] = useState<string>()

  useEffect(() => {
    if (redirectSlug && !isDirty) {
      Router.push(`${baseUrl}/study-modules/${redirectSlug}/edit`)
    }
  }, [redirectSlug, isDirty])

  const [addStudyModule] = useMutation(AddStudyModuleDocument)
  const [updateStudyModule] = useMutation(UpdateStudyModuleDocument)
  const [deleteStudyModule] = useMutation(DeleteStudyModuleDocument, {
    refetchQueries: [
      { query: StudyModulesDocument },
      { query: EditorStudyModulesDocument },
    ],
  })

  const onSubmit = useCallback(
    async (values: StudyModuleFormValues): Promise<void> => {
      const isNewStudyModule = !values.id

      const mutationVariables = fromStudyModuleForm({ values })
      const refetchQueries = [
        { query: StudyModulesDocument },
        { query: EditorStudyModulesDocument },
        ...(!isNewStudyModule
          ? [StudyModuleExistsDocument, EditorStudyModuleDetailsDocument].map(
              (query) => ({
                query,
                variables: { slug: values.new_slug },
              }),
            )
          : []),
      ] as ApolloClient.QueryOptions[]

      try {
        addSnackbar({ message: t("statusSaving") })
        if (isNewStudyModule) {
          const { data } = await addStudyModule({
            variables: { study_module: mutationVariables },
            refetchQueries: () => refetchQueries,
          })
          addSnackbar({
            message: t("statusSavingSuccess"),
            severity: "success",
          })
          resetAfterSubmit()
          setRedirectSlug(data?.addStudyModule?.slug ?? values.new_slug)
          return
        }
        await updateStudyModule({
          variables: { study_module: mutationVariables },
          refetchQueries: () => refetchQueries,
        })
        addSnackbar({ message: t("statusSavingSuccess"), severity: "success" })
      } catch (err: any) {
        console.error("error saving", JSON.stringify(err.message, null, 2))
        addSnackbar({ message: t("statusSavingError"), severity: "error" })
      }
    },
    [t, baseUrl],
  )

  const onError: SubmitErrorHandler<StudyModuleFormValues> = useCallback(
    (errors: Record<string, any>, _?: any) => {
      addSnackbar({ message: t("statusValidationErrors"), severity: "warning" })
      scrollFirstErrorIntoView({ errors })
    },
    [t],
  )

  const onDelete = useCallback(async (id: string) => {
    await deleteStudyModule({ variables: { id } })
    /*Router.push(`/study-modules`, undefined, {
      shallow: true,
    })*/
  }, [])

  const onCancel = useCallback(
    () =>
      Router.push(`/study-modules`, undefined, {
        shallow: true,
      }),
    [],
  )

  const editorContextValue = useMemo(
    () => ({
      tab: 0,
      anchors,
    }),
    [anchors],
  )
  const editorMethodContextValue = useMemo(
    () => ({
      setTab: () => void 0,
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
          <StudyModuleEditForm />
        </EditorContainer>
      </EditorContextProvider>
    </FormProvider>
  )
}

export default withEnumeratingAnchors(StudyModuleEdit)
