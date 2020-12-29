import { useForm, FormProvider, Controller } from "react-hook-form"
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
} from "/components/Dashboard/Editor2/FormFields"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import FormContainer from "/components/Dashboard/Editor2/FormContainer"
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
import FormContext from "/components/Dashboard/Editor2/FormContext"
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
const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`

const ModuleListItem = styled(ListItem)<any>`
  padding: 0px;
`
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

export default function CourseEditor({
  course,
  studyModules,
}: CourseEditorProps) {
  const t = useTranslator(CoursesTranslations)
  const { setStatus } = useContext(FormContext)

  const statuses = statusesT(t)
  const client = useApolloClient()

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

  console.log("default", defaultValues)
  const methods = useForm<CourseFormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    //reValidateMode: "onChange"
  })

  console.log(course)
  const { handleSubmit, watch, control, setValue, formState } = methods
  console.log(formState)
  const [tab, setTab] = useState(0)

  const onSubmit = useCallback(async (data: CourseFormValues, e?: any) => {
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

  //const onSubmit = (data: Object, e?: any) => console.log(data, e)
  const onError = (errors: Record<string, any>, e?: any) =>
    console.log(errors, e)
  const onCancel = () => console.log("cancelled")
  const onDelete = useCallback(async (id: string) => {
    console.log("would delete", id)
    //await deleteCourse({ variables: { id }})
  }, [])

  const setCourseModule = useCallback(
    (value: CourseDetails_course_study_modules[]) => (
      _: any,
      checked: boolean,
    ) =>
      setValue(
        "study_modules",
        checked
          ? value.concat({
              __typename: "StudyModule",
              id: module.id,
            })
          : value.filter((s) => s.id !== module.id),
        { shouldDirty: true },
      ),
    [],
  )

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <FormProvider {...methods}>
        <FormContainer<CourseFormValues>
          onSubmit={onSubmit}
          onError={onError}
          onCancel={onCancel}
          onDelete={onDelete}
        >
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            style={{ backgroundColor: "white", padding: "2rem" }}
            autoComplete="none"
          >
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
              <ControlledTextField
                name="name"
                label={t("courseName")}
                required={true}
              />
              <CourseTranslationForm />
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
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
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
              <FormControl>
                <FormLabel>{t("courseModules")}</FormLabel>
                <FormGroup>
                  <ModuleList>
                    <EnumeratingAnchor id="study_modules" />
                    <FieldController
                      name="study_modules"
                      label={t("courseModules")}
                      renderComponent={({
                        value,
                      }: {
                        value: CourseDetails_course_study_modules[]
                      }) => (
                        <>
                          {studyModules?.map(
                            (
                              module: CourseEditorStudyModules_study_modules,
                            ) => (
                              <ModuleListItem key={module.id}>
                                <FormControlLabel
                                  key={`study-module-${module.id}`}
                                  checked={
                                    false
                                    /*value?.filter((s) => s.id === module.id)
                                      .length > 0*/
                                  }
                                  onChange={setCourseModule(value)}
                                  control={<Checkbox />}
                                  label={module.name}
                                />
                              </ModuleListItem>
                            ),
                          )}
                        </>
                      )}
                    />
                  </ModuleList>
                </FormGroup>
              </FormControl>
              <ControlledImageInput
                name="new_photo"
                label={t("courseNewPhoto")}
              />
            </TabSection>
          </form>
        </FormContainer>
      </FormProvider>
    </LocalizationProvider>
  )
}
