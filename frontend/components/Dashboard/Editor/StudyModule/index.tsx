import { useCallback } from "react"

import { FormikHelpers } from "formik"
import Router from "next/router"

import { PureQueryOptions, useApolloClient, useMutation } from "@apollo/client"

import studyModuleEditSchema from "./form-validation"
import { fromStudyModuleForm, toStudyModuleForm } from "./serialization"
import StudyModuleEditForm from "./StudyModuleEditForm"
import { StudyModuleFormValues } from "./types"
import {
  AddStudyModuleMutation,
  DeleteStudyModuleMutation,
  UpdateStudyModuleMutation,
} from "/graphql/mutations/studyModule"
import {
  EditorStudyModuleDetailsQuery,
  EditorStudyModulesQuery,
  StudyModuleExistsQuery,
  StudyModulesQuery,
} from "/graphql/queries/studyModule"
import { StudyModuleDetailedFieldsFragment } from "/static/types/generated"
import ModulesTranslations from "/translations/study-modules"
import { useTranslator } from "/util/useTranslator"

const StudyModuleEdit = ({
  module,
}: {
  module?: StudyModuleDetailedFieldsFragment
}) => {
  const t = useTranslator(ModulesTranslations)

  const [addStudyModule] = useMutation(AddStudyModuleMutation)
  const [updateStudyModule] = useMutation(UpdateStudyModuleMutation)
  const [deleteStudyModule] = useMutation(DeleteStudyModuleMutation, {
    refetchQueries: [
      { query: StudyModulesQuery },
      { query: EditorStudyModulesQuery },
    ],
  })
  const checkSlug = StudyModuleExistsQuery

  const client = useApolloClient()

  const initialValues = toStudyModuleForm({ module })

  const validationSchema = studyModuleEditSchema({
    client,
    checkSlug,
    initialSlug: module?.slug && module.slug !== "" ? module.slug : null,
    t,
  })

  const onSubmit = useCallback(
    async (
      values: StudyModuleFormValues,
      { setSubmitting, setStatus }: FormikHelpers<StudyModuleFormValues>,
    ): Promise<void> => {
      const newStudyModule = !values.id

      const mutationVariables = fromStudyModuleForm({ values })
      const refetchQueries = [
        { query: StudyModulesQuery },
        { query: EditorStudyModulesQuery },
        !newStudyModule
          ? {
              query: EditorStudyModuleDetailsQuery,
              variables: { slug: values.new_slug },
            }
          : undefined,
      ].filter((v) => !!v) as PureQueryOptions[]

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
      module={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}

export default StudyModuleEdit
