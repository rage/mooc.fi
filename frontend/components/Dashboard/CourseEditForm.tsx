import React, { useState, useEffect } from "react"
import {
  Grid,
  InputLabel,
  FormControl,
  FormControlLabel,
  MenuItem,
  LinearProgress,
  Paper,
  Button,
} from "@material-ui/core"
import { Formik, Field, FieldArray, Form, FormikProps } from "formik"
import {
  fieldToTextField,
  TextField,
  TextFieldProps,
  SimpleFileUpload,
  Select,
  Checkbox,
} from "formik-material-ui"
import * as Yup from "yup"
import get from "lodash/get"

const statuses = [
  {
    value: "upcoming",
    label: "Upcoming",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "ended",
    label: "Ended",
  },
]

const languages = [
  {
    value: "en",
    label: "English",
  },
  {
    value: "fi",
    label: "Finnish",
  },
]

const CourseEditSchema = Yup.object().shape({
  name: Yup.string().required("required"),
  slug: Yup.string().required("required"),
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
      link: Yup.string().url(),
    }),
  ),
})

const initialValues = {
  name: "",
  slug: "",
  photo: undefined,
  start_point: false,
  promote: false,
  status: "Upcoming",
  study_module: null,
  course_translations: [],
}

const initialTranslation = {
  language: undefined,
  name: undefined,
  description: undefined,
  link: undefined,
}

const Thumbnail = ({ file }: { file: Blob | undefined }) => {
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState<any>(undefined)

  useEffect(() => {
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setLoading(false)
      setImage(reader.result)
    }

    try {
      reader.readAsDataURL(file)
    } catch (e) {
      setLoading(false)
    }
  }, [file, loading, image])

  if (loading || !image) {
    return null
  }

  return <img src={image} height={250} />
}

const languageFilter = (index: number, course_translations: Array<any>) =>
  languages.filter(
    l =>
      !course_translations
        .filter((_, idx) => idx !== index)
        .map((c: any) => c.language)
        .includes(l.value),
  )

const getError = (errors: any, path: string, index: number, field: string) => {
  return get(errors, `${path}[${index}].${field}`)
}

const renderForm = ({
  submitForm,
  errors,
  isSubmitting,
  values,
  setFieldValue,
}: FormikProps<any>) => (
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
      name="slug"
      type="text"
      label="Slug"
      error={errors.slug}
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
    <Field
      name="photo"
      type="file"
      label="Photo"
      fullWidth
      component={SimpleFileUpload}
    />
    <Thumbnail file={values.photo} />
    <br />
    <FieldArray
      name="course_translations"
      render={helpers => (
        <>
          {values.course_translations &&
          values.course_translations.length > 0 ? (
            values.course_translations.map((_: any, index: number) => (
              <React.Fragment key={`translation-${index}`}>
                <InputLabel>Language</InputLabel>
                <Field
                  name={`course_translations[${index}].language`}
                  type="select"
                  label="Language"
                  errors={getError(
                    errors,
                    "course_translations",
                    index,
                    "language",
                  )}
                  fullWidth
                  component={Select}
                >
                  {languages.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  name={`course_translations[${index}].name`}
                  type="text"
                  label="Name"
                  errors={getError(
                    errors,
                    "course_translations",
                    index,
                    "name",
                  )}
                  fullWidth
                  component={TextField}
                />
                <Field
                  name={`course_translations[${index}].description`}
                  type="text"
                  label="Description"
                  errors={getError(
                    errors,
                    "course_translations",
                    index,
                    "description",
                  )}
                  fullWidth
                  component={TextField}
                />
                <Field
                  name={`course_translations[${index}].link`}
                  type="text"
                  label="Link"
                  fullWidth
                  component={TextField}
                />
                {index === values.course_translations.length - 1 &&
                index < languages.length - 1 &&
                languageFilter(index + 1, values.course_translations).length >
                  0 ? (
                  <Button
                    variant="contained"
                    onClick={() => helpers.push(initialTranslation)}
                  >
                    +
                  </Button>
                ) : null}
                <Button
                  variant="contained"
                  onClick={() => helpers.remove(index)}
                >
                  -
                </Button>
              </React.Fragment>
            ))
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => helpers.push({})}
            >
              Add a translation
            </Button>
          )}
        </>
      )}
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
  firebaseUpload,
}: {
  course: any
  firebaseUpload: Function
}) => (
  <Formik
    initialValues={course || initialValues}
    validationSchema={CourseEditSchema}
    onSubmit={(values, { setSubmitting }) => {
      console.log("submitted", JSON.stringify(values))
      if (values.photo) {
        firebaseUpload(values.photo).then((snapshot: any) => {
          console.log("uploaded and got", snapshot)
        })
      }
      setSubmitting(false)
    }}
    render={renderForm}
  />
)

export default CourseEditForm
