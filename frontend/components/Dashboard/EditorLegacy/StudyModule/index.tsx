import { useCallback, useMemo, useRef } from "react"

import { FormikHelpers } from "formik"
import Router from "next/router"

import {
  useApolloClient,
  useMutation,
  type PureQueryOptions,
} from "@apollo/client"

import studyModuleEditSchema from "./form-validation"
import { fromStudyModuleForm, toStudyModuleForm } from "./serialization"
import StudyModuleEditForm from "./StudyModuleEditForm"
import { StudyModuleFormValues } from "./types"
import StudyModulesTranslations from "/translations/study-modules"
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
  const t = useTranslator(StudyModulesTranslations)

  const [addStudyModule] = useMutation(AddStudyModuleDocument)
  const [updateStudyModule] = useMutation(UpdateStudyModuleDocument)
  const [deleteStudyModule] = useMutation(DeleteStudyModuleDocument, {
    refetchQueries: [
      { query: StudyModulesDocument },
      { query: EditorStudyModulesDocument },
    ],
  })

  const client = useApolloClient()

  const initialValues = useRef(toStudyModuleForm({ module }))

  const validationSchema = useMemo(
    () =>
      studyModuleEditSchema({
        client,
        initialSlug: module?.slug && module.slug !== "" ? module.slug : null,
        t,
      }),
    [client, module, t],
  )

  const onSubmit = useCallback(
    async (
      values: StudyModuleFormValues,
      { setSubmitting, setStatus }: FormikHelpers<StudyModuleFormValues>,
    ): Promise<void> => {
      const newStudyModule = !values.id

      const mutationVariables = fromStudyModuleForm({ values })
      const refetchQueries = [
        { query: StudyModulesDocument },
        { query: EditorStudyModulesDocument },
        ...(!newStudyModule
          ? [StudyModuleExistsDocument, EditorStudyModuleDetailsDocument].map(
              (query) => ({
                query,
                variables: { slug: values.new_slug },
              }),
            )
          : []),
      ] as PureQueryOptions[]

      const moduleMutation = newStudyModule ? addStudyModule : updateStudyModule

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
        setSubmitting(false)
      }
    },
    [],
  )

  const onDelete = useCallback(async (values: StudyModuleFormValues) => {
    if (values.id) {
      await deleteStudyModule({ variables: { id: values.id } })
      Router.push(`/study-modules`, undefined, {
        shallow: true,
      })
    }
  }, [])

  const onCancel = useCallback(
    () =>
      Router.push(`/study-modules`, undefined, {
        shallow: true,
      }),
    [],
  )

  return (
    <StudyModuleEditForm
      module={initialValues.current}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}

export default StudyModuleEdit
