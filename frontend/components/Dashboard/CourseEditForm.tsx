import React from "react"
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  MenuItem,
  LinearProgress,
  Button,
} from "@material-ui/core"
import {
  Formik,
  Field,
  Form,
  FieldProps,
  FormikActions,
  FormikProps,
  getIn,
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
import { updateCourseVariables } from "./__generated__/updateCourse"
import { updateCourseTranslationVariables } from "./__generated__/updateCourseTranslation"
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
  <Form>
    <Field
      name="name"
      type="text"
      label="Name"
      error={errors.name}
      fullWidth
      component={TextField}
    />
    <br />
    <Field
      name="new_slug"
      type="text"
      label="Slug"
      error={errors.new_slug}
      fullWidth
      component={TextField}
    />
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
    <br />
    <FormControl>
      <InputLabel htmlFor="status">Status</InputLabel>
      <Field
        name="status"
        type="text"
        label="Status"
        component={Select}
        errors={errors.status}
        fullWidth
      >
        {statuses.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Field>
      {errors && errors.status ? (
        <div style={{ color: "red" }}>required</div>
      ) : null}
    </FormControl>
    <br />
    <FormControl>
      <InputLabel htmlFor="new_photo">Photo</InputLabel>
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
            onImageLoad={(value: any) => setFieldValue("thumbnail", value)}
          >
            <ImagePreview
              file={values.thumbnail}
              onClose={(
                e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
              ): void => {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
                setFieldValue("new_photo", undefined)
                setFieldValue("thumbnail", undefined)
              }}
            />
          </ImageDropzoneInput>
        )}
      />
    </FormControl>
    <br />
    <CourseTranslationEditForm
      values={values.course_translations}
      errors={errors.course_translations}
    />
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

  const onSubmit = async (
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

        if (values.photo) {
          deletablePhoto = values.photo
        }
      }
    } else if (values.photo) {
      // delete existing photo
      newValues.photo = undefined
      deletablePhoto = values.photo
    }

    if (deletablePhoto) {
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
  }

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
