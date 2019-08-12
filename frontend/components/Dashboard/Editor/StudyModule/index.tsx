import React, { useCallback } from "react"
import StudyModuleEditForm from "./StudyModuleEditForm"
import { StudyModuleFormValues } from "./types"
import { useMutation, useApolloClient } from "@apollo/react-hooks"
import {
  AddStudyModuleMutation,
  UpdateStudyModuleMutation,
  DeleteStudyModuleMutation,
  CheckModuleSlugQuery,
} from "./graphql"
import { AllModulesQuery } from "../../../../pages/study-modules"
import studyModuleEditSchema from "./form-validation"
import { FormikActions } from "formik"
import Next18next from "../../../../i18n"
import { StudyModuleDetails_study_module } from "/static/types/StudyModuleDetails"
import { StudyModuleQuery } from "/pages/study-modules/[id]/edit"
import { PureQueryOptions } from "apollo-boost"
import { toStudyModuleForm, fromStudyModuleForm } from "./serialization"

const StudyModuleEdit = ({
  module,
}: {
  module?: StudyModuleDetails_study_module
}) => {
  const addStudyModule: any = useMutation(AddStudyModuleMutation)
  const updateStudyModule: any = useMutation(UpdateStudyModuleMutation)
  const deleteStudyModule: any = useMutation(DeleteStudyModuleMutation, {
    refetchQueries: [{ query: AllModulesQuery }],
  })
  const checkSlug = CheckModuleSlugQuery

  const client = useApolloClient()

  const initialValues = toStudyModuleForm({ module })

  const validationSchema = studyModuleEditSchema({
    client,
    checkSlug,
    initialSlug:
      module && module.slug && module.slug !== "" ? module.slug : null,
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
        !newStudyModule
          ? { query: StudyModuleQuery, variables: { slug: values.new_slug } }
          : undefined,
      ].filter(v => !!v) as PureQueryOptions[]

      const moduleMutation = newStudyModule ? addStudyModule : updateStudyModule

      try {
        setStatus({ message: "Saving..." })
        // TODO/FIXME: return value?
        await moduleMutation({
          variables: mutationVariables,
          // @ts-ignore
          refetchQueries: (result: FetchResult) => refetchQueries,
        })

        setStatus({ message: null })
        Next18next.Router.push("/study-modules")
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
      await deleteStudyModule({ variables: { slug: values.slug } })
      Next18next.Router.push("/study-modules")
    }
  }, [])

  const onCancel = useCallback(
    () => Next18next.Router.push("/study-modules"),
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
