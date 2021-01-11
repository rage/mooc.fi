import { useCallback, useContext, useEffect, useState } from "react"
import StudyModuleEditForm from "./StudyModuleEditForm"
import { StudyModuleFormValues } from "./types"
import { useMutation, useApolloClient } from "@apollo/client"
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
import { StudyModuleDetails_study_module } from "/static/types/generated/StudyModuleDetails"
import { StudyModuleQuery } from "/pages/[lng]/study-modules/[id]/edit"
import { PureQueryOptions } from "@apollo/client"
import { toStudyModuleForm, fromStudyModuleForm } from "./serialization"
import Router from "next/router"
import LanguageContext from "/contexes/LanguageContext"
import ModulesTranslations from "/translations/study-modules"
import { useTranslator } from "/util/useTranslator"
import { SubmitErrorHandler, useForm, FormProvider } from "react-hook-form"
import { FormStatus } from "/components/Dashboard/Editor2/types"
import { useAnchorContext } from "/contexes/AnchorContext"
import { getFirstErrorAnchor } from "/util/useEnumeratingAnchors"
import { EditorContext } from "../EditorContext"
import { customValidationResolver } from "/components/Dashboard/Editor2/Common"

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
    resolver: customValidationResolver<StudyModuleFormValues>(validationSchema),
    mode: "onBlur",
  })
  const { trigger, formState } = methods

  console.log(formState)
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
        Router.push("/[lng]/study-modules", `/${language}/study-modules`, {
          shallow: true,
        })
      } catch (err) {
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
    Router.push("/[lng]/study-modules", `/${language}/study-modules`, {
      shallow: true,
    })
  }, [])

  const onCancel = useCallback(
    () =>
      Router.push("/[lng]/study-modules", `/${language}/study-modules`, {
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

export default StudyModuleEdit
