import { useForm, FormProvider, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useApolloClient } from "@apollo/client"
import { CheckSlugQuery } from "/graphql/queries/courses"
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
import { DateTime } from "luxon"
import { CourseStatus } from "/static/types/generated/globalTypes"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import DisableAutoComplete from "/components/DisableAutoComplete"
import {
  FieldController,
  ControlledTextField,
  ControlledDatePicker,
  ControlledImageInput,
} from "/components/Dashboard/Editor2/FormFields"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import FormContainer from "/components/Dashboard/Editor2/FormContainer"
import CourseTranslationForm from "./CourseTranslationForm"
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

  const statuses = statusesT(t)
  const client = useApolloClient()

  const validationSchema = courseEditSchema({
    client,
    checkSlug: CheckSlugQuery,
    initialSlug: course?.slug && course.slug !== "" ? course.slug : null,
    t,
  })

  const methods = useForm({
    defaultValues: {
      ...course,
      new_slug: course.slug,
      start_date: course.start_date ? DateTime.fromISO(course.start_date) : "",
      end_date: course.end_date ? DateTime.fromISO(course.end_date) : "",
      ects: course.ects ?? "",
      status: CourseStatus[course.status ?? "Upcoming"],
      thumbnail: course.photo?.compressed,
      delete_photo: false,
      new_photo: null,
    },
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    //reValidateMode: "onChange"
  })

  console.log(course)
  const { handleSubmit, control, setValue, formState } = methods
  console.log(formState)
  const [tab, setTab] = useState(0)

  const onSubmit = (data: Object, e?: any) => console.log(data, e)
  const onError = (errors: Object, e?: any) => console.log(errors, e)
  const onCancel = () => console.log("cancelled")
  const onDelete = (id: string) => console.log("deleted", id)

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
        <FormContainer
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
              <Controller
                name="id"
                control={control}
                as={<input type="hidden" />}
              />
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
                                    value.filter((s) => s.id === module.id)
                                      .length > 0
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
                defaultValue={course.photo}
                label={t("courseNewPhoto")}
              />
            </TabSection>
          </form>
        </FormContainer>
      </FormProvider>
    </LocalizationProvider>
  )
}
