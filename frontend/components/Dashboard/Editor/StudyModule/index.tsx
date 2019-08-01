import React, { useCallback } from "react"
import StudyModuleEditForm from "./StudyModuleEditForm"
import {
  StudyModuleFormValues,
  StudyModuleTranslationFormValues,
} from "./types"
import { useMutation } from "react-apollo-hooks"
import {
  AddStudyModuleMutation,
  UpdateStudyModuleMutation,
  DeleteStudyModuleMutation,
} from "./graphql"
import { AllModulesQuery } from "../../../../pages/study-modules"
import { initialValues } from "./form-validation"
import studyModuleEditSchema from "./form-validation"
import { FormikActions } from "formik"
import Next18next from "../../../../i18n"

const StudyModuleEdit = ({ module }: { module?: StudyModuleFormValues }) => {
  const addStudyModule = useMutation(AddStudyModuleMutation, {
    refetchQueries: [{ query: AllModulesQuery }],
  })
  const updateStudyModule = useMutation(UpdateStudyModuleMutation)
  const deleteStudyModule = useMutation(DeleteStudyModuleMutation, {
    refetchQueries: [{ query: AllModulesQuery }],
  })

  const _module: StudyModuleFormValues = module
    ? {
        ...module,
      }
    : initialValues

  const validationSchema = studyModuleEditSchema

  const onSubmit = useCallback(
    async (
      values: StudyModuleFormValues,
      { setSubmitting, setStatus }: FormikActions<StudyModuleFormValues>,
    ): Promise<void> => {
      const newStudyModule = !values.id

      const study_module_translations = values.study_module_translations.length
        ? values.study_module_translations.map(
            (c: StudyModuleTranslationFormValues) => ({
              ...c,
              id: !c.id || c.id === "" ? null : c.id,
              __typename: undefined,
            }),
          )
        : null

      const moduleMutation = newStudyModule ? addStudyModule : updateStudyModule

      try {
        setStatus({ message: "Saving..." })
        const study_module = await moduleMutation({
          variables: {
            ...values,
            study_module_translations,
          },
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
      await deleteStudyModule({ variables: { id: values.id } })
      Next18next.Router.push("/study-modules")
    }
  }, [])

  const onCancel = useCallback(
    () => Next18next.Router.push("/study-modules"),
    [],
  )

  return (
    <StudyModuleEditForm
      module={_module}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  )
}

export default StudyModuleEdit
