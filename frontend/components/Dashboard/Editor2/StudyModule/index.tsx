import { useCallback, useEffect, useMemo, useState } from "react"

import Router from "next/router"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"

import {
  useApolloClient,
  useMutation,
  type PureQueryOptions,
} from "@apollo/client"

import { EditorContext } from "../EditorContext"
import studyModuleEditSchema from "./form-validation"
import { fromStudyModuleForm, toStudyModuleForm } from "./serialization"
import StudyModuleEditForm from "./StudyModuleEditForm"
import { StudyModuleFormValues } from "./types"
import { customValidationResolver } from "/components/Dashboard/Editor2/Common"
import { FormStatus } from "/components/Dashboard/Editor2/types"
import { useAnchorContext } from "/contexts/AnchorContext"
import withEnumeratingAnchors from "/lib/with-enumerating-anchors"
import ModulesTranslations from "/translations/study-modules"
import { getFirstErrorAnchor } from "/util/useEnumeratingAnchors"
import { useTranslator } from "/util/useTranslator"

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

const StudyModuleEdit = ({ module }: StudyModuleEditProps) => {
  const t = useTranslator(ModulesTranslations)
  const [status, setStatus] = useState<FormStatus>({ message: null })
  const client = useApolloClient()
  const { anchors } = useAnchorContext()

  const defaultValues = toStudyModuleForm({ module })
  const validationSchema = studyModuleEditSchema({
    client,
    initialSlug: module?.slug && module.slug !== "" ? module.slug : null,
    t,
  })
  const methods = useForm<StudyModuleFormValues>({
    defaultValues,
    resolver: customValidationResolver(validationSchema),
    mode: "onBlur",
  })
  const { trigger } = methods

  useEffect(() => {
    trigger()
  }, [])

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
      ] as PureQueryOptions[]

      const moduleMutation = isNewStudyModule
        ? addStudyModule
        : updateStudyModule

      try {
        setStatus({ message: "Saving..." })
        // TODO/FIXME: return value?
        await moduleMutation({
          variables: { study_module: mutationVariables },
          refetchQueries: () => refetchQueries,
        })

        setStatus({ message: null })
        Router.push(`/study-modules`, undefined, {
          shallow: true,
        })
      } catch (err: any) {
        setStatus({ message: err.message, error: true })
        console.error(err)
        // setSubmitting(false)
      }
    },
    [],
  )

  const onError: SubmitErrorHandler<StudyModuleFormValues> = useCallback(
    (errors: Record<string, any>, _?: any) => {
      const { anchorLink } = getFirstErrorAnchor(anchors, errors)

      setTimeout(() => {
        const element = document.getElementById(anchorLink)
        element?.scrollIntoView()
      }, 100)
    },
    [],
  )

  const onDelete = useCallback(async (id: string) => {
    await deleteStudyModule({ variables: { id } })
    Router.push(`/study-modules`, undefined, {
      shallow: true,
    })
  }, [])

  const onCancel = useCallback(
    () =>
      Router.push(`/study-modules`, undefined, {
        shallow: true,
      }),
    [],
  )

  const contextValue = useMemo(
    () => ({
      status,
      tab: 0,
      initialValues: defaultValues,
      setStatus,
      setTab: () => void 0,
      onSubmit,
      onError,
      onCancel,
      onDelete,
    }),
    [status, defaultValues],
  )

  return (
    <FormProvider {...methods}>
      <EditorContext.Provider value={contextValue}>
        <StudyModuleEditForm />
      </EditorContext.Provider>
    </FormProvider>
  )
}

export default withEnumeratingAnchors(StudyModuleEdit)
