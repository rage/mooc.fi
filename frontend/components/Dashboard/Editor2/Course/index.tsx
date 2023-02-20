import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { omit } from "lodash"
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form"

import {
  useApolloClient,
  useMutation,
  type PureQueryOptions,
} from "@apollo/client"

import { EditorContext } from "../EditorContext"
import CourseEditForm from "./CourseEditForm"
import { fromCourseForm, toCourseForm } from "./serialization"
import { CourseFormValues } from "./types"
import { useCustomValidationResolver } from "/components/Dashboard/Editor2/Common"
import courseEditSchema from "/components/Dashboard/Editor2/Course/form-validation"
import { FormStatus } from "/components/Dashboard/Editor2/types"
import { useAnchorContext } from "/contexts/AnchorContext"
import withEnumeratingAnchors from "/lib/with-enumerating-anchors"
import CoursesTranslations from "/translations/courses"
import { getFirstErrorAnchor } from "/util/useEnumeratingAnchors"
import { useTranslator } from "/util/useTranslator"

import {
  AddCourseDocument,
  CourseEditorOtherCoursesDocument,
  CourseFromSlugDocument,
  CoursesDocument,
  CourseUpsertArg,
  DeleteCourseDocument,
  EditorCourseDetailedFieldsFragment,
  EditorCourseOtherCoursesFieldsFragment,
  EditorCoursesDocument,
  StudyModuleDetailedFieldsFragment,
  TagCoreFieldsFragment,
  UpdateCourseDocument,
} from "/graphql/generated"

interface CourseEditProps {
  course?: EditorCourseDetailedFieldsFragment
  courses?: EditorCourseOtherCoursesFieldsFragment[]
  studyModules?: StudyModuleDetailedFieldsFragment[]
  tags?: TagCoreFieldsFragment[]
}

function CourseEditor({
  course,
  courses,
  studyModules,
  tags,
}: CourseEditProps) {
  const t = useTranslator(CoursesTranslations)
  const [status, setStatus] = useState<FormStatus>({ message: null })
  const [tab, setTab] = useState(0)
  const { anchors } = useAnchorContext()
  const client = useApolloClient()

  const defaultValues = useRef(
    toCourseForm({
      course,
      modules: studyModules,
    }),
  )
  const validationSchema = useMemo(
    () =>
      courseEditSchema({
        client,
        initialSlug: course?.slug && course.slug !== "" ? course.slug : null,
        t,
      }),
    [course, client, t],
  )
  const tagOptions = useMemo(
    () =>
      (tags ?? []).map((tag) => ({
        ...omit(tag, ["__typename", "id"]),
        _id: tag.id,
        types: tag.types ?? [],
        tag_translations: (tag.tag_translations ?? []).map((translation) => ({
          ...translation,
          description: translation.description ?? undefined,
        })),
      })),
    [tags],
  )

  const methods = useForm<CourseFormValues>({
    defaultValues: defaultValues.current,
    resolver: useCustomValidationResolver(validationSchema),
    mode: "onBlur",
    //reValidateMode: "onChange"
  })
  const { trigger } = methods

  useEffect(() => {
    // validate on load
    trigger()
  }, [])

  const [addCourse] = useMutation(AddCourseDocument)
  const [updateCourse] = useMutation(UpdateCourseDocument)
  const [deleteCourse] = useMutation(DeleteCourseDocument, {
    refetchQueries: [
      { query: CoursesDocument },
      { query: EditorCoursesDocument },
      { query: CourseEditorOtherCoursesDocument },
    ],
  })

  const onSubmit = useCallback(async (values: CourseFormValues) => {
    const isNewCourse = !values.id

    const mutationVariables = fromCourseForm({
      values,
      initialValues: defaultValues.current,
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

    console.log("would mutate", mutationVariables)
    try {
      setStatus({ message: t("statusSaving") })

      console.log("trying to save")
      if (isNewCourse) {
        await addCourse({
          variables: { course: mutationVariables },
          refetchQueries: () => refetchQueries,
        })
      } else {
        await updateCourse({
          variables: { course: mutationVariables as CourseUpsertArg },
          refetchQueries: () => refetchQueries,
        })
      }
      setStatus({ message: null })
    } catch (err: any) {
      setStatus({ message: err.message, error: true })
    }
  }, [])

  const onError: SubmitErrorHandler<CourseFormValues> = useCallback(
    (errors: Record<string, any>) => {
      const { anchor, anchorLink } = getFirstErrorAnchor(anchors, errors)

      setTab(anchor?.tab ?? 0)

      setTimeout(() => {
        const element = document.getElementById(anchorLink)
        element?.scrollIntoView()
      }, 100)
    },
    [],
  )

  const onCancel = useCallback(() => console.log("cancelled"), [])
  const onDelete = useCallback(async (id: string) => {
    await deleteCourse({ variables: { id } })
  }, [])

  const contextValue = useMemo(
    () => ({
      status,
      tab,
      initialValues: defaultValues.current,
      setStatus,
      setTab,
      onSubmit,
      onError,
      onCancel,
      onDelete,
    }),
    [status, tab, defaultValues],
  )

  return (
    <FormProvider {...methods}>
      <EditorContext.Provider value={contextValue}>
        <CourseEditForm
          course={course}
          courses={courses}
          studyModules={studyModules}
          tags={tagOptions}
        />
      </EditorContext.Provider>
    </FormProvider>
  )
}

export default withEnumeratingAnchors(CourseEditor)
