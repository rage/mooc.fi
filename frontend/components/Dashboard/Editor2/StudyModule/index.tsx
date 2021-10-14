import { useCallback, useContext, useEffect, useState } from "react"

import { customValidationResolver } from "/components/Dashboard/Editor2/Common"
import { FormStatus } from "/components/Dashboard/Editor2/types"
import { useAnchorContext } from "/contexts/AnchorContext"
import LanguageContext from "/contexts/LanguageContext"
import {
  AddStudyModuleMutation,
  DeleteStudyModuleMutation,
  UpdateStudyModuleMutation,
} from "/graphql/mutations/study-modules"
import {
  AllEditorModulesQuery,
  AllModulesQuery,
  CheckModuleSlugQuery,
} from "/graphql/queries/study-modules"
import withEnumeratingAnchors from "/lib/with-enumerating-anchors"
import { StudyModuleQuery } from "/pages/[lng]/study-modules/[slug]/edit"
import { StudyModuleDetails_study_module } from "/static/types/generated/StudyModuleDetails"
import ModulesTranslations from "/translations/study-modules"
import { getFirstErrorAnchor } from "/util/useEnumeratingAnchors"
import { useTranslator } from "/util/useTranslator"
import Router from "next/router"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"

import { PureQueryOptions, useApolloClient, useMutation } from "@apollo/client"

import { EditorContext } from "../EditorContext"
import studyModuleEditSchema from "./form-validation"
import { fromStudyModuleForm, toStudyModuleForm } from "./serialization"
import StudyModuleEditForm from "./StudyModuleEditForm"
import { StudyModuleFormValues } from "./types"

const StudyModuleEdit = ({
  module,
}: {
  module?: StudyModuleDetails_study_module
}) => {
  const { language } = useContext(LanguageContext)
  const t = useTranslator(ModulesTranslations)
  const [status, setStatus] = useState<FormStatus>({ message: null })
  const client = useApolloClient()
  const { anchors } = useAnchorContext()

  const checkSlug = CheckModuleSlugQuery

  const defaultValues = toStudyModuleForm({ module })
  const validationSchema = studyModuleEditSchema({
    client,
    checkSlug,
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

  const [addStudyModule] = useMutation(AddStudyModuleMutation)
  const [updateStudyModule] = useMutation(UpdateStudyModuleMutation)
  const [deleteStudyModule] = useMutation(DeleteStudyModuleMutation, {
    refetchQueries: [
      { query: AllModulesQuery },
      { query: AllEditorModulesQuery },
    ],
  })

  const onSubmit = useCallback(
    async (values: StudyModuleFormValues): Promise<void> => {
      const newStudyModule = !values.id

      const mutationVariables = fromStudyModuleForm({ values })
      const refetchQueries = [
        { query: AllModulesQuery },
        { query: AllEditorModulesQuery },
        !newStudyModule
          ? { query: StudyModuleQuery, variables: { slug: values.new_slug } }
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
        Router.push(`/${language}/study-modules`, undefined, {
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
    Router.push(`/${language}/study-modules`, undefined, {
      shallow: true,
    })
  }, [])

  const onCancel = useCallback(
    () =>
      Router.push(`/${language}/study-modules`, undefined, {
        shallow: true,
      }),
    [],
  )

  return (
    <FormProvider {...methods}>
      <EditorContext.Provider
        value={{
          tab: 0,
          setTab: () => {},
          status,
          setStatus,
          onSubmit,
          onError,
          onCancel,
          onDelete,
          initialValues: defaultValues,
        }}
      >
        <StudyModuleEditForm />
      </EditorContext.Provider>
    </FormProvider>
  )
}

export default withEnumeratingAnchors(StudyModuleEdit)
