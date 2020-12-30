import {
  useForm,
  FormProvider,
  Controller,
  SubmitErrorHandler,
} from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { PureQueryOptions, useApolloClient, useMutation } from "@apollo/client"
import {
  AllCoursesQuery,
  AllEditorCoursesQuery,
  CheckSlugQuery,
  CourseEditorCoursesQuery,
} from "/graphql/queries/courses"
import {
  CourseDetails_course,
  CourseDetails_course_study_modules,
} from "/static/types/generated/CourseDetails"
import courseEditSchema from "/components/Dashboard/Editor/Course/form-validation"
import {
  useState,
  PropsWithChildren,
  DetailedHTMLProps,
  useCallback,
  useContext,
  SyntheticEvent,
  useEffect,
} from "react"
import {
  Tabs,
  Tab,
  Checkbox,
  List,
  ListItem,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Button
} from "@material-ui/core"
import styled from "styled-components"
import { omit } from "lodash"
import { EnumeratingAnchor } from "/components/Dashboard/Editor/common"
import LocalizationProvider from "@material-ui/lab/LocalizationProvider"
import AdapterLuxon from "@material-ui/lab/AdapterLuxon"
import { CourseStatus } from "/static/types/generated/globalTypes"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import DisableAutoComplete from "/components/DisableAutoComplete"
import {
  FieldController,
  ControlledTextField,
  ControlledDatePicker,
  ControlledImageInput,
  ControlledHiddenField,
  ControlledModuleList,
  ControlledCheckbox,
} from "/components/Dashboard/Editor2/FormFields"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import EditorContainer from "../EditorContainer"
import CourseTranslationForm from "./CourseTranslationForm"
import {
  AddCourseMutation,
  UpdateCourseMutation,
  DeleteCourseMutation,
} from "/graphql/mutations/courses"
import { CourseFormValues } from "./types"
import { fromCourseForm, toCourseForm } from "./serialization"
import { CourseQuery } from "/pages/[lng]/courses/[id]/edit"
import notEmpty from "/util/notEmpty"
import { useEditorContext, EditorContextProvider } from "../EditorContext"
import CourseLanguageSelector from "./CourseLanguageSelector"
import flattenKeys from "/util/flattenKeys"
import { useAnchorContext } from "/contexes/AnchorContext"
import useDebounce from "/util/useDebounce"

export const FormFieldGroup = styled.fieldset`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  width: 90%;
  margin: 1rem auto 3rem auto;
  border-width: 0px;
  border-bottom: 4px dotted #98b0a9;
`
const SelectLanguageFirstCover = styled.div<{ covered: boolean }>`
  ${(props) => `opacity: ${props.covered ? `0.2` : `1`}`}
`
interface TabSectionProps {
  currentTab: number
  tab: number
}
const TabSection = ({
  currentTab,
  tab,
  children,
  ...props
}: PropsWithChildren<TabSectionProps> &
  DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => (
  <section
    style={{
      ...(currentTab !== tab ? { display: "none" } : {}),
      ...(props as any)?.style,
    }}
    {...omit(props, "style")}
  >
    {children}
  </section>
)

interface CourseEditorProps {
  course: CourseDetails_course
  studyModules?: CourseEditorStudyModules_study_modules[]
}

export const statusesT = (t: Function) => [
  {
    value: CourseStatus.Upcoming,
    label: t("courseUpcoming"),
  },
  {
    value: CourseStatus.Active,
    label: t("courseActive"),
  },
  {
    value: CourseStatus.Ended,
    label: t("courseEnded"),
  },
]

function CourseEditorForm({
  course,
  studyModules,
}: CourseEditorProps) {
  const t = useTranslator(CoursesTranslations)
  const { setStatus, undo, redo, push, history } = useEditorContext<CourseFormValues>()

  const statuses = statusesT(t)
  const client = useApolloClient()
  const { anchors } = useAnchorContext()

  const [addCourse] = useMutation(AddCourseMutation)
  const [updateCourse] = useMutation(UpdateCourseMutation)
  const [deleteCourse] = useMutation(DeleteCourseMutation, {
    refetchQueries: [
      { query: AllCoursesQuery },
      { query: AllEditorCoursesQuery },
      { query: CourseEditorCoursesQuery },
    ],
  })

  const validationSchema = courseEditSchema({
    client,
    checkSlug: CheckSlugQuery,
    initialSlug: course?.slug && course.slug !== "" ? course.slug : null,
    t,
  })

  const defaultValues = toCourseForm({
    course,
    modules: studyModules,
  })

  const [selectedLanguage, setSelectedLanguage] = useState(
    defaultValues?.course_translations.length === 0
      ? ""
      : defaultValues?.course_translations.length == 2
        ? "both"
        : defaultValues?.course_translations[0].language,
  )

  const methods = useForm<CourseFormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    //reValidateMode: "onChange"
  })
  // console.log(course)
  const {
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState,
    errors,
    trigger,
    reset
  } = methods

  useEffect(() => {
    // validate on load
    trigger()
    /*push({
      values: defaultValues,
      tab: 0
    })*/
  }, [])

  // const formValues = getValues()
  const [debouncedValues, cancel] = useDebounce(watch(), 1000, true)
  useEffect(() => {
    console.log("would push", debouncedValues)
    push({
      values: debouncedValues,
      tab
    })
  }, [debouncedValues])

  // console.log(formState)
  // console.log("errors", errors)
  const [tab, setTab] = useState(0)

  const onSubmit = useCallback(async (data: CourseFormValues, _?: any) => {
    const newCourse = !data.id
    const mutationVariables = fromCourseForm({
      values: data,
      initialValues: defaultValues,
    })
    // - if we create a new course, we refetch all courses so the new one is on the list
    // - if we update, we also need to refetch that course with a potentially updated slug
    const refetchQueries = [
      { query: AllCoursesQuery },
      { query: AllEditorCoursesQuery },
      { query: CourseEditorCoursesQuery },
      !newCourse
        ? { query: CourseQuery, variables: { slug: data.new_slug } }
        : undefined,
    ].filter(notEmpty) as PureQueryOptions[]

    const courseMutation = newCourse ? addCourse : updateCourse

    console.log("would mutate", mutationVariables)
    try {
      setStatus({ message: t("statusSaving") })

      console.log("trying to save")
      await courseMutation({
        variables: { course: mutationVariables },
        refetchQueries: () => refetchQueries,
      })
      setStatus({ message: null })
    } catch (err) {
      console.log("whoops?", err)
      setStatus({ message: err.message, error: true })
    }
  }, [])

  const onError: SubmitErrorHandler<CourseFormValues> = useCallback((
    errors: Record<string, any>,
    _?: any,
  ) => {
    const flattenedErrors = flattenKeys(errors)

    const [key, value] = Object.entries(flattenedErrors).sort(
      (a, b) => anchors[a[0]]?.id - anchors[b[0]]?.id,
    )[0]
    const anchor = anchors[key]

    let anchorLink = key
    if (Array.isArray(value)) {
      const firstIndex = parseInt(Object.keys(value)[0])
      anchorLink = `${key}[${firstIndex}].${Object.keys(value[firstIndex])[0]}`
    }
    setTab(anchor?.tab ?? 0)

    setTimeout(() => {
      const element = document.getElementById(anchorLink)
      element?.scrollIntoView()
    }, 100)
  }, [])

  const onCancel = useCallback(() => console.log("cancelled"), [])
  const onDelete = useCallback(async (id: string) => {
    console.log("would delete", id)
    //await deleteCourse({ variables: { id }})
  }, [])

  const setCourseModule = useCallback(
    (event: SyntheticEvent<Element, Event>, checked: boolean) =>
      setValue(
        "study_modules",
        {
          ...getValues("study_modules"),
          [(event.target as HTMLInputElement).id]: checked,
        },
        { shouldDirty: true },
      ),
    [],
  )

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <FormProvider {...methods}>
        <EditorContainer
          onSubmit={onSubmit}
          onError={onError}
          onCancel={onCancel}
          onDelete={onDelete}
        >
          <form
            // onChange={() => push({ values: debouncedValues, tab })}
            onSubmit={handleSubmit(onSubmit, onError)}
            style={{ backgroundColor: "white", padding: "2rem" }}
            autoComplete="none"
          >
            <Button onClick={() => {
              undo()
              for (const [key, value] of Object.entries(history.states[history.index - 1].values)) {
                setValue(key, value)
              }
            }}>Undo</Button>
            <Button onClick={redo}>Redo</Button>
            <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
              <Tab label="Course info" value={0} />
            </Tabs>
            <TabSection
              currentTab={tab}
              tab={0}
              style={{ paddingTop: "0.5rem" }}
            >
              <DisableAutoComplete />
              <ControlledHiddenField name="id" defaultValue={watch("id")} />
              <ControlledHiddenField name="slug" defaultValue={watch("slug")} />
              <CourseLanguageSelector
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
              />
              <CourseTranslationForm />
              <SelectLanguageFirstCover covered={selectedLanguage === ""}>
                <ControlledTextField
                  name="name"
                  label={t("courseName")}
                  required={true}
                />
                <ControlledTextField
                  name="new_slug"
                  label={t("courseSlug")}
                  required={true}
                  tip="A helpful text"
                />
                <ControlledTextField name="ects" label={t("courseECTS")} />
                <ControlledDatePicker
                  name="start_date"
                  label={t("courseStartDate")}
                  required={true}
                />
                <ControlledDatePicker
                  name="end_date"
                  label={t("courseEndDate")}
                  validateOtherFields={["start_date"]}
                />
                <ControlledTextField
                  name="teacher_in_charge_name"
                  label={t("courseTeacherInChargeName")}
                  required={true}
                />
                <ControlledTextField
                  name="teacher_in_charge_email"
                  label={t("courseTeacherInChargeEmail")}
                  required={true}
                />
                <ControlledTextField
                  name="support_email"
                  label={t("courseSupportEmail")}
                />
                <FormControl component="fieldset">
                  <FormLabel component="legend" style={{ color: "#DF7A46" }}>
                    {t("courseStatus")}*
                  </FormLabel>
                  <EnumeratingAnchor id="status" />
                  <FieldController
                    name="status"
                    label={t("courseStatus")}
                    renderComponent={({ value }) => (
                      <RadioGroup
                        aria-label="course status"
                        value={value}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) =>
                          setValue(
                            "status",
                            (event.target as HTMLInputElement).value,
                            { shouldDirty: true },
                          )
                        }
                      >
                        {statuses.map(
                          (option: { value: string; label: string }) => (
                            <FormControlLabel
                              key={`status-${option.value}`}
                              value={option.value}
                              control={<Radio />}
                              label={option.label}
                            />
                          ),
                        )}
                      </RadioGroup>
                    )}
                  />
                </FormControl>
                <ControlledModuleList
                  name="study_modules"
                  label={t("courseModules")}
                  onChange={setCourseModule}
                  modules={studyModules}
                />
                <ControlledImageInput
                  name="new_photo"
                  label={t("courseNewPhoto")}
                />
                <FormFieldGroup>
                  <FormControl>
                    <FormLabel>{t("courseProperties")}</FormLabel>
                    <ControlledCheckbox
                      name="promote"
                      label={t("coursePromote")}
                    />
                    <ControlledCheckbox
                      name="start_point"
                      label={t("courseStartPoint")}
                    />
                  </FormControl>
                </FormFieldGroup>
              </SelectLanguageFirstCover>
            </TabSection>
          </form>
        </EditorContainer>
      </FormProvider>
    </LocalizationProvider>
  )
}

export default function CourseEditor({
  course,
  studyModules,
}: CourseEditorProps) {
  return (
    <EditorContextProvider<CourseFormValues>>
      <CourseEditorForm
        course={course}
        studyModules={studyModules}
      />
    </EditorContextProvider>
  )
}