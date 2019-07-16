import React, { useState, useEffect } from "react"
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  MenuItem,
  LinearProgress,
  Button,
  ButtonBase,
} from "@material-ui/core"
import {
  Formik,
  Field,
  Form,
  FieldProps,
  FormikActions,
  FormikProps,
  FormikErrors,
  getIn,
} from "formik"
import { TextField, Select, Checkbox } from "formik-material-ui"
import * as Yup from "yup"
import pullAll from "lodash/pullAll"
import { useApolloClient } from "react-apollo-hooks"
import { useDropzone } from "react-dropzone"
import styled from "styled-components"
import CourseTranslationEditForm, {
  CourseTranslationFormValues,
} from "./CourseTranslationEditForm"
import { CourseStatus } from "../../__generated__/globalTypes"
import { addImage_addImage as Image } from "./__generated__/addImage"
import {
  updateCourseVariables as Course,
  updateCourse_updateCourse_course_translations,
} from "./__generated__/updateCourse"
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

/* const CourseEditSchema = Yup.object().shape({
  name: Yup.string().required("required"),
  new_slug: Yup.string().required("required"),
  status: Yup.mixed()
    .oneOf(statuses.map(s => s.value))
    .required("required"),
  course_translations: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("required"),
      language: Yup.mixed()
        .oneOf(languages.map(l => l.value))
        .required("required"),
      description: Yup.string(),
      link: Yup.string()
        .url()
        .required("required"),
    }),
  ),
}) */

interface CourseFormValues extends Course {
  new_photo: undefined | File
  new_slug: string
  thumbnail?: string
  course_translations: (CourseTranslationFormValues | undefined)[]
  study_module: string | null | undefined
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

const CloseButton = styled(ButtonBase)`
  position: relative;
  top: -10px;
  right: -10px;
  border-radius: 10em;
  padding: 2px 6px 3px;
  text-decoration: none;
  font: 700 21px/20px sans-serif;
  background: #555;
  border: 3px solid #fff;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  -webkit-transition: background 0.5s;
  transition: background 0.5s;

  :hover {
    background: #e54e4e;
    padding: 3px 7px 5px;
    top: -11px;
    right: -11px;
  }

  :active {
    background: #e54e4e;
    top: -10px;
    right: -11px;
  }
`

const Thumbnail = ({
  file,
  onDelete,
}: {
  file: string | undefined
  onDelete: Function
}) => {
  if (!file) {
    return null
  }

  return (
    <div>
      <CloseButton
        onClick={e => {
          e.stopPropagation()
          e.nativeEvent.stopImmediatePropagation()
          onDelete(e)
        }}
      >
        &times;
      </CloseButton>
      <img src={file} height={250} />
    </div>
  )
}

const ImageDropzoneInput = ({ field, form }: FieldProps<CourseFormValues>) => {
  const { touched, errors, setFieldValue } = form
  const [error, setError] = useState<string | null>(null)

  const onDrop = (accepted: File[], rejected: File[]) => {
    const reader = new FileReader()

    reader.onload = () => {
      setFieldValue("thumbnail", reader.result)
    }

    if (accepted.length) {
      console.log(accepted[0])
      setFieldValue(field.name, accepted[0])
      reader.readAsDataURL(accepted[0])
    }

    if (rejected.length) {
      setError("not an image!")
    } else {
      setError("")
    }
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
  } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
    preventDropOnDocument: true,
  })

  return (
    <div {...getRootProps()}>
      <Thumbnail
        file={
          form.values.thumbnail /*form.values[field.name] || form.values.photo*/
        }
        onDelete={() => setFieldValue(field.name, null)}
      />
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop an image file here</p>
      ) : (
        <p>Drop image or click to select</p>
      )}
      {acceptedFiles.map(f => console.log(f))}
      {error ? <p>{error}</p> : null}
    </div>
  )
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
    <InputLabel>Photo</InputLabel>
    <Field name="thumbnail" type="hidden" />
    <Field
      name="new_photo"
      type="file"
      label="Upload new photo"
      fullWidth
      component={ImageDropzoneInput}
    />
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

const validate = (props: any) => (
  values: CourseFormValues,
): Promise<FormikErrors<CourseFormValues>> => {
  // TODO: either use validationSchema here or validate otherwise
  return new Promise(async resolve => {
    let errors: FormikErrors<CourseFormValues> = {}

    if (values.new_slug) {
      let res

      try {
        res = await props.client.query({
          query: props.checkSlug,
          variables: { slug: values.new_slug },
        })
      } catch (e) {
        return
      }

      const { data } = res

      const existing = data.course_exists

      if (existing) {
        if (values.new_slug && values.new_slug !== values.slug) {
          errors.new_slug = "must be unique"
        }
      }
    } else {
      errors.new_slug = "required"
    }

    return resolve(errors)
  }).then((errors: FormikErrors<CourseFormValues>) => {
    if (Object.keys(errors).length) {
      throw errors
    }
  })
}

const CourseEditForm = ({
  course,
  addCourse,
  updateCourse,
  checkSlug,
  uploadImage,
}: // onSubmit
{
  course: any
  addCourse: Function
  updateCourse: Function
  checkSlug: Function
  uploadImage: Function
  /*   onSubmit: Function
   */
}) => {
  console.log("course", course)
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

    if (new_photo) {
      const uploadedImage: Image | null = await uploadImage(new_photo)

      if (uploadedImage) {
        newValues.photo = uploadedImage.id
        setFieldValue("new_photo", null)
        setFieldValue("thumbnail", uploadedImage.compressed)
      }
    }

    console.log("new values?", newValues)
    const course = await mutation({
      variables: {
        ...newValues,
        id: undefined,
        slug: values.id ? values.slug : values.new_slug,
        course_translations: values.course_translations.length
          ? values.course_translations.map(
              (c: updateCourse_updateCourse_course_translations) => ({
                ...c,
                id: c.id === "" ? null : c.id,
                // course: values.id ? values.id : null,
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
      validate={validate({ client, checkSlug })}
      onSubmit={onSubmit}
      render={renderForm}
    />
  )
}

export default CourseEditForm
