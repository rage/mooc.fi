import React, { useCallback, useContext } from "react"
import StudyModuleEditForm from "./StudyModuleEditForm"
import { StudyModuleFormValues } from "./types"
import { useMutation, useApolloClient } from "@apollo/react-hooks"
import {
  AddStudyModuleMutation,
  UpdateStudyModuleMutation,
  DeleteStudyModuleMutation,
} from "/graphql/mutations/study-modules"
import {
  AllModulesQuery,
  AllEditorModulesQuery,
  CheckModuleSlugQuery,
} from "/graphql/queries/study-modules"
import studyModuleEditSchema from "./form-validation"
import { FormikActions } from "formik"
import { StudyModuleDetails_study_module } from "/static/types/generated/StudyModuleDetails"
import { StudyModuleQuery } from "/pages/[lng]/study-modules/[id]/edit"
import { PureQueryOptions } from "apollo-boost"
import { toStudyModuleForm, fromStudyModuleForm } from "./serialization"
import Router from "next/router"
import LanguageContext from "/contexes/LanguageContext"

const StudyModuleEdit = ({
  module,
}: {
  module?: StudyModuleDetails_study_module
}) => {
  const { language } = useContext(LanguageContext)

  const [addStudyModule] = useMutation(AddStudyModuleMutation)
  const [updateStudyModule] = useMutation(UpdateStudyModuleMutation)
  const [deleteStudyModule] = useMutation(DeleteStudyModuleMutation, {
    refetchQueries: [
      { query: AllModulesQuery },
      { query: AllEditorModulesQuery },
    ],
  })
  const checkSlug = CheckModuleSlugQuery

  const client = useApolloClient()

  const initialValues = toStudyModuleForm({ module })

  const validationSchema = studyModuleEditSchema({
    client,
    checkSlug,
    initialSlug: module?.slug && module.slug !== "" ? module.slug : null,
  })

  const onSubmit = useCallback(
    async (
      values: StudyModuleFormValues,
      { setSubmitting, setStatus }: FormikActions<StudyModuleFormValues>,
    ): Promise<void> => {
      const newStudyModule = !values.id

      const mutationVariables = fromStudyModuleForm({ values })
      const refetchQueries = [
        { query: AllModulesQuery },
        { query: AllEditorModulesQuery },
        !newStudyModule
          ? { query: StudyModuleQuery, variables: { slug: values.new_slug } }
          : undefined,
      ].filter(v => !!v) as PureQueryOptions[]

      const moduleMutation = newStudyModule ? addStudyModule : updateStudyModule

      try {
        setStatus({ message: "Saving..." })
        // TODO/FIXME: return value?
        await moduleMutation({
          variables: { study_module: mutationVariables },
          refetchQueries: () => refetchQueries,
        })

        setStatus({ message: null })
        Router.push("/[lng]/study-modules", `/${language}/study-modules`, {
          shallow: true,
        })
      } catch (err) {
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
      Router.push("/[lng]/study-modules", `/${language}/study-modules`, {
        shallow: true,
      })
    }
  }, [])

  const onCancel = useCallback(
    () =>
      Router.push("/[lng]/study-modules", `/${language}/study-modules`, {
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
