import {
  useForm,
  Controller,
  useFormContext,
  FormProvider,
  ControllerRenderProps,
} from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useApolloClient } from "@apollo/client"
import { CheckSlugQuery } from "/graphql/queries/courses"
import { CourseDetails_course, CourseDetails_course_study_modules } from "/static/types/generated/CourseDetails"
import courseEditSchema from "/components/Dashboard/Editor/Course/form-validation"
import {
  useContext,
  useState,
  PropsWithChildren,
  DetailedHTMLProps,
  useEffect,
  useCallback,
} from "react"
import LanguageContext from "/contexes/LanguageContext"
import getCoursesTranslator from "/translations/courses"
import getCommonTranslator from "/translations/common"
import {
  Grid,
  Paper,
  Container,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Checkbox,
  List,
  ListItem,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  FormGroup,
  CircularProgress,
  Radio,
  RadioGroup,
  Tooltip,
} from "@material-ui/core"
import styled from "styled-components"
import { omit } from "lodash"
import { ErrorMessage } from "@hookform/error-message"
import { EnumeratingAnchor } from "/components/Dashboard/Editor/common"
import DatePicker from "@material-ui/lab/DatePicker"
import LocalizationProvider from "@material-ui/lab/LocalizationProvider"
import AdapterLuxon from "@material-ui/lab/AdapterLuxon"
import LuxonUtils from "@date-io/luxon"
import { DateTime } from "luxon"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { useConfirm } from "material-ui-confirm"
import { CourseStatus } from "/static/types/generated/globalTypes"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import HelpIcon from "@material-ui/icons/Help"
import DisableAutoComplete from "/components/DisableAutoComplete"

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
const FormBackground = styled(Paper)`
  padding: 2em;
`
const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`

const ModuleListItem = styled(ListItem) <any>`
  padding: 0px;
`
interface CourseEditorProps {
  course: CourseDetails_course
  studyModules?: CourseEditorStudyModules_study_modules[]
}

interface FieldProps {
  name: string
  label: string
  required?: boolean
  tab?: number
}
interface FieldControllerProps extends FieldProps {
  renderComponent: (props: ControllerRenderProps) => JSX.Element
}

const FieldController = ({
  name,
  label,
  required = false,
  tab = 0,
  renderComponent,
}: FieldControllerProps) => {
  const { control, errors, setValue } = useFormContext()

  const onChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(name, target.value, { shouldValidate: true }),
    [name],
  )

  return (
    <Controller
      name={name}
      control={control}
      autoComplete="disabled"
      render={(renderProps) => (
        <div style={{ marginBottom: "1.5rem" }}>
          <EnumeratingAnchor id={name} tab={tab} />
          {renderComponent({ ...renderProps, onChange })}
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <FormHelperText style={{ color: "#f44336" }}>
                {message}
              </FormHelperText>
            )}
          />
        </div>
      )}
    />
  )
}

interface ControlledFieldProps extends FieldProps {
  tip?: string
  validateOtherFields?: Array<string>
}

const ControlledTextField = (props: ControlledFieldProps) => {
  const { errors, setValue } = useFormContext()
  const { label, required, name, tip } = props

  return (
    <FieldController
      {...props}
      renderComponent={({ onBlur, value, ref }) => (
        <TextField
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(name, e.target.value, { shouldDirty: true })
          }}
          onBlur={onBlur}
          value={value}
          label={label}
          required={required}
          variant="outlined"
          error={Boolean(errors[name as keyof typeof errors])}
          InputProps={{
            autoComplete: "none",
            endAdornment: tip ?
              <Tooltip title={tip}>
                <HelpIcon />
              </Tooltip>
              : null
          }}
        />
      )}
    />
  )
}

const ControlledDatePicker = (props: ControlledFieldProps) => {
  const { watch, setValue, trigger } = useFormContext()
  const { name, label, validateOtherFields = [] } = props

  return (
    <FieldController
      {...props}
      renderComponent={({ ref }) => (
        <DatePicker
          value={watch(name)}
          onChange={(date: any) => {
            setValue(name, date, { shouldValidate: true, shouldDirty: true })
            return { value: date }
          }}
          onClose={() => trigger([name, ...validateOtherFields])}
          label={label}
          ref={ref}
          allowKeyboardControl={true}
          renderInput={(params) => <TextField {...params} variant="outlined" />}
/*          InputProps={{
            endAdornment:
              <IconButton style={{ padding: 0 }}>
                <CalendarIcon />
              </IconButton>
          }}*/
        />
      )}
    />
  )
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

export default function CourseEditor({ course, studyModules }: CourseEditorProps) {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const t2 = getCommonTranslator(language)

  const statuses = statusesT(t)
  const client = useApolloClient()
  const confirm = useConfirm()

  const validationSchema = courseEditSchema({
    client,
    checkSlug: CheckSlugQuery,
    initialSlug: course?.slug && course.slug !== "" ? course.slug : null,
    t,
  })

  console.log(course)
  const methods = useForm({
    defaultValues: {
      ...course,
      new_slug: course.slug,
      start_date: course.start_date ? DateTime.fromISO(course.start_date) : "",
      end_date: course.end_date ? DateTime.fromISO(course.end_date) : "",
      ects: course.ects ?? "",
      status: CourseStatus[course.status ?? "Upcoming"],
    },
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
    //reValidateMode: "onChange"
  })

  const { handleSubmit, formState, setValue } = methods
  const { isSubmitting, isSubmitted, isDirty } = formState
  const [tab, setTab] = useState(0)

  const onSubmit = (data: Object, e?: any) => console.log(data, e)
  const onError = (errors: Object, e?: any) => console.log(errors, e)
  const onCancel = () => console.log("cancelled")

  //console.log(errors)
  //console.log("dirty:", dirtyFields)
  //console.log("touched:", touched)

  return (
    <Container maxWidth="md">
      <FormBackground elevation={1} style={{ backgroundColor: "#8C64AC" }}>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <FormProvider {...methods}>
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
                <FormControl>
                  <FormLabel>{t("courseModules")}</FormLabel>
                  <FormGroup>
                    <ModuleList>
                      <EnumeratingAnchor id="study_modules" />
                      <FieldController
                        name="study_modules"
                        label={t("courseModules")}
                        renderComponent={({ value }: { value: CourseDetails_course_study_modules[] }) => (
                          <>
                            {studyModules?.map(
                              (module: CourseEditorStudyModules_study_modules) => (
                                <ModuleListItem key={module.id}>
                                  <FormControlLabel
                                    key={`study-module-${module.id}`}
                                    checked={value.filter((s) => s.id === module.id).length > 0}
                                    onChange={(
                                      _,
                                      checked
                                    ) =>
                                      setValue(
                                        "study_modules",
                                        checked ? value.concat({ __typename: "StudyModule", id: module.id }) : value.filter(s => s.id !== module.id),
                                        { shouldDirty: true }
                                      )
                                    }
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
              </TabSection>
            </form>
          </FormProvider>
        </LocalizationProvider>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={4}>
            <StyledButton
              color="primary"
              disabled={!isDirty || isSubmitting || isSubmitted}
              onClick={() => handleSubmit(onSubmit, onError)()}
              style={{ width: "100%" }}
            >
              {isSubmitting ? <CircularProgress size={20} /> : t2("save")}
            </StyledButton>
          </Grid>
          <Grid item xs={4}>
            <StyledButton
              color="secondary"
              style={{ width: "100%" }}
              disabled={isSubmitting || isSubmitted}
              variant="contained"
              onClick={() =>
                isDirty
                  ? confirm({
                    title: t2("confirmationUnsavedChanges"),
                    description: t2("confirmationLeaveWithoutSaving"),
                    confirmationText: t2("confirmationYes"),
                    cancellationText: t2("confirmationNo"),
                  })
                    .then(onCancel)
                    .catch(() => { })
                  : onCancel()
              }
            >
              {t2("cancel")}
            </StyledButton>
          </Grid>
        </Grid>
      </FormBackground>
    </Container >
  )
}
