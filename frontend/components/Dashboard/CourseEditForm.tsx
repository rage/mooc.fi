import React, { useCallback } from "react"
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  MenuItem,
  LinearProgress,
  Button,
  Grid,
  Container,
} from "@material-ui/core"
import {
  Formik,
  Field,
  Form,
  FieldProps,
  FormikActions,
  FormikProps,
  getIn,
  yupToFormErrors,
} from "formik"
import { TextField, Select, Checkbox } from "formik-material-ui"
import * as Yup from "yup"
import { useApolloClient } from "react-apollo-hooks"
import { ApolloClient } from "apollo-client"
import CourseTranslationEditForm, {
  CourseTranslationFormValues,
} from "./CourseTranslationEditForm"
import ImageDropzoneInput from "./ImageDropzoneInput"
import ImagePreview from "./ImagePreview"
import { CourseStatus } from "../../__generated__/globalTypes"
import { addImage_addImage as Image } from "./__generated__/addImage"
import Next18next from "../../i18n"

const statuses = [
  {
    value: CourseStatus.Upcoming,
    label: "Upcoming",
  },
  {
    value: CourseStatus.Active,
    label: "Active",
  },
  {
    value: CourseStatus.Ended,
    label: "Ended",
  },
]

const study_modules: { value: any; label: any }[] = []

const validateSlug = ({
  slug,
  checkSlug,
  client,
}: {
  slug: string
  checkSlug: Function
  client: any
}) => async (value: string) => {
  let res

  try {
    res = await client.query({
      query: checkSlug,
      variables: { slug: value },
    })
  } catch (e) {
    return true
  }

  const { data } = res
  const existing = data.course_exists

  return existing ? value === slug : !existing
}

const courseEditSchema = ({
  client,
  checkSlug,
  slug,
}: {
  client: ApolloClient<object>
  checkSlug: Function
  slug: string
}) =>
  Yup.object().shape({
    name: Yup.string().required("required"),
    new_slug: Yup.string()
      .required("required")
      .test(
        "unique",
        `slug is already in use`,
        validateSlug({ client, checkSlug, slug }),
      ),
    status: Yup.mixed()
      .oneOf(statuses.map(s => s.value))
      .required("required"),
    course_translations: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("required"),
        language: Yup.string().required("required"),
        /* TODO: checking that there's no more than one translation per lanaguage per course needs custom validation */
        /*       mixed()
        .oneOf(languages.map(l => l.value))
        .required("required"), */
        description: Yup.string(),
        link: Yup.string()
          .url("must be a valid URL")
          .required("required"),
      }),
    ),
  })

interface CourseFormValues {
  id?: string | null
  name: string
  slug: string
  photo: any
  start_point: boolean
  promote: boolean
  status: CourseStatus
  course_translations: CourseTranslationFormValues[]
  study_module: string | null | undefined
  thumbnail?: string
  new_photo: undefined | File
  new_slug: string
}

const initialValues: CourseFormValues = {
  id: null,
  name: "",
  slug: "",
  new_slug: "",
  thumbnail: undefined,
  photo: undefined,
  new_photo: undefined,
  start_point: false,
  promote: false,
  status: CourseStatus.Upcoming,
  study_module: null,
  course_translations: [],
}

const renderForm = ({
  submitForm,
  errors,
  isSubmitting,
  values,
  setFieldValue,
}: FormikProps<CourseFormValues>) => (
  <Grid container direction="column">
    <Form style={{ lineHeight: "2" }}>
      <Grid item>
        <Field
          name="name"
          type="text"
          label="Name"
          error={errors.name}
          fullWidth
          component={TextField}
        />
        <Field
          name="new_slug"
          type="text"
          label="Slug"
          error={errors.new_slug}
          fullWidth
          component={TextField}
        />
      </Grid>
      <Grid item container direction="row">
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Field
                label="Promote"
                type="checkbox"
                name="promote"
                component={Checkbox}
              />
            }
            label="Promote"
          />
          <FormControlLabel
            control={
              <Field
                label="Start point"
                type="checkbox"
                name="start_point"
                component={Checkbox}
              />
            }
            label="Start point"
          />
        </Grid>
        <Grid item container xs={12} sm={6} justify="space-between">
          <Grid item>
            <FormControl>
              <InputLabel htmlFor="study_module" shrink>
                Study module
              </InputLabel>
              <Field
                name="study_module"
                type="text"
                label="Study module"
                component={Select}
                errors={errors.study_module}
                width="100%"
              >
                {study_modules.map(option => (
                  <MenuItem key={`module-${option.value}`} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <InputLabel htmlFor="status" shrink>
                Status
              </InputLabel>
              <Field
                name="status"
                type="text"
                label="Status"
                component={Select}
                errors={errors.status}
                fullWidth
              >
                {statuses.map(option => (
                  <MenuItem key={`status-${option.value}`} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
              {errors && errors.status ? (
                <div style={{ color: "red" }}>required</div>
              ) : null}
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container direction="column">
        <Grid item>
          <InputLabel htmlFor="new_photo" shrink>
            Photo
          </InputLabel>
        </Grid>
        <Grid item>
          <FormControl>
            <Field name="thumbnail" type="hidden" />
            <Field
              name="new_photo"
              type="file"
              label="Upload new photo"
              fullWidth
              render={({ field, form }: FieldProps<CourseFormValues>) => (
                <ImageDropzoneInput
                  field={field}
                  form={form}
                  onImageLoad={(value: any) =>
                    setFieldValue("thumbnail", value)
                  }
                >
                  <ImagePreview
                    file={values.thumbnail}
                    onClose={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ): void => {
                      e.stopPropagation()
                      e.nativeEvent.stopImmediatePropagation()
                      setFieldValue("photo", undefined)
                      setFieldValue("new_photo", undefined)
                      setFieldValue("thumbnail", undefined)
                    }}
                  />
                </ImageDropzoneInput>
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid item container direction="column">
        <CourseTranslationEditForm
          values={values.course_translations}
          errors={errors.course_translations}
          isSubmitting={isSubmitting}
        />
      </Grid>
      {isSubmitting && <LinearProgress />}
      <br />
      <Button
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        onClick={submitForm}
      >
        Submit
      </Button>
    </Form>
  </Grid>
)

const CourseEditForm = ({
  course,
  addCourse,
  updateCourse,
  checkSlug,
  uploadImage,
  deleteImage,
}: // onSubmit
{
  course: any
  addCourse: Function
  updateCourse: Function
  checkSlug: Function
  uploadImage: Function
  deleteImage: Function
  /*   onSubmit: Function
   */
}) => {
  const init = course
    ? {
        ...course,
        new_slug: course.slug,
        thumbnail: course.photo ? course.photo.compressed : null,
      }
    : initialValues
  const client = useApolloClient()

  const onSubmit = useCallback(
    async (
      values: CourseFormValues,
      { setSubmitting, setFieldValue }: FormikActions<CourseFormValues>,
    ): Promise<void> => {
      const newCourse = !values.id

      // try {
      const newValues: CourseFormValues = {
        ...values,
        photo: getIn(values, "photo.id"),
      }
      const { new_photo }: { new_photo: File | undefined } = values
      const mutation = newCourse ? addCourse : updateCourse

      let deletablePhoto: Image | null = null

      if (new_photo) {
        const uploadedImage: Image | null = await uploadImage(new_photo)

        if (uploadedImage) {
          newValues.photo = uploadedImage.id
          setFieldValue("new_photo", null)
          setFieldValue("thumbnail", uploadedImage.compressed)

          if (init.photo) {
            deletablePhoto = init.photo
          }

          setFieldValue("photo", uploadedImage.id)
        }
      } else if (init.photo && !values.photo) {
        // delete existing photo
        newValues.photo = undefined
        deletablePhoto = init.photo
      }

      if (deletablePhoto) {
        // TODO? does return boolean on delete status
        await deleteImage({ variables: { id: deletablePhoto.id } })
      }

      const course = await mutation({
        variables: {
          ...newValues,
          id: undefined,
          slug: values.id ? values.slug : values.new_slug,
          course_translations: values.course_translations.length
            ? values.course_translations.map(
                (c: CourseTranslationFormValues) => ({
                  ...c,
                  id: !c.id || c.id === "" ? null : c.id,
                  __typename: undefined,
                }),
              )
            : null,
        },
      })

      //  setSubmitting(false)
      //  Next18next.Router.push("/courses")
      //} catch (err) {
      //  console.error(err)
      setSubmitting(false)
      //}
    },
    [],
  )

  return (
    <Formik
      initialValues={init}
      validationSchema={courseEditSchema({
        client,
        checkSlug,
        slug: init.slug,
      })}
      onSubmit={onSubmit}
      render={renderForm}
    />
  )
}

export default CourseEditForm
