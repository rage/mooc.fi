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
  ButtonBase,
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
import pullAll from "lodash/pullAll"
import { useApolloClient } from "react-apollo-hooks"
import Dropzone, { useDropzone } from "react-dropzone"
import styled from "styled-components"

const statuses = [
  {
    value: "Upcoming",
    label: "Upcoming",
  },
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Ended",
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
})

const initialValues = {
  name: "",
  slug: "",
  new_slug: "",
  photo: undefined,
  new_photo: undefined,
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
  /*   const [loading, setLoading] = useState(true)
  const [image, setImage] = useState<any>(undefined)

  useEffect(() => {
    if (!file) {
      return
    }

    if (typeof file === 'string') {
      setImage(file)
      setLoading(false)
      
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
  } */

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

const ImageDropzoneInput = ({ field, form, ...props }) => {
  const { touched, errors, setFieldValue } = form
  const [error, setError] = useState<string | null>(null)

  const onDrop = (accepted: any[], rejected: any[], event) => {
    const reader = new FileReader()

    reader.onload = () =>
      setFieldValue(field.name, { ...accepted[0], blob: reader.result })

    if (accepted.length) {
      const file = accepted[0]

      console.log(accepted[0])
      setFieldValue(field.name, accepted[0])
      //reader.readAsDataURL(accepted[0])
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
        file={form.values[field.name] || form.values.photo}
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
    <Field
      name="new_photo"
      type="file"
      label="Upload new photo"
      fullWidth
      component={ImageDropzoneInput}
    />
    {console.log(values)}
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
                  errors={getError(
                    errors,
                    "course_translations",
                    index,
                    "link",
                  )}
                  fullWidth
                  component={TextField}
                />
                {/* TODO here: don't actually remove in case of misclicks */}
                {index === values.course_translations.length - 1 &&
                index < languages.length - 1 &&
                languageFilter(index + 1, values.course_translations).length >
                  0 ? (
                  <Button
                    variant="contained"
                    onClick={() => helpers.push({ ...initialTranslation })}
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

const validate = props => values => {
  // TODO: either use validationSchema here or validate otherwise
  return new Promise(async resolve => {
    let errors = {}

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

      const existing = data.course && data.course.id

      if (existing) {
        if (values.id && values.id !== existing) {
          errors.new_slug = "must be unique"
        }
      }
    } else {
      errors.new_slug = "required"
    }

    return resolve(errors)
  }).then(errors => {
    if (Object.keys(errors).length) {
      throw errors
    }
  })
}

const CourseEditForm = ({
  course,
  addCourse,
  updateCourse,
  addCourseTranslation,
  updateCourseTranslation,
  deleteCourseTranslation,
  checkSlug,
  addImage,
}: {
  course: any
  addCourse: Function
  updateCourse: Function
  addCourseTranslation: Function
  updateCourseTranslation: Function
  deleteCourseTranslation: Function
  checkSlug: Function
  addImage: Function
}) => {
  const init = course ? { ...course, new_slug: course.slug } : initialValues
  const initialTranslationIds = (init.course_translations || []).map(t => t.id)
  const client = useApolloClient()

  return (
    <Formik
      initialValues={init}
      validate={validate({ client, checkSlug })}
      onSubmit={async (values, { setSubmitting, setFieldValue }) => {
        console.log(values)
        console.log(JSON.stringify(values))
        if (values.id) {
          const newValues = { ...values }

          if (values.new_photo) {
            const { new_photo } = values

            /*             const photoFile = {
              lastModified: new_photo.lastModified,
              lastModifiedDate: new_photo.lastModifiedDate,
              name: new_photo.name,
              path: new_photo.path,
              type: new_photo.type,
              size: new_photo.size
            }
 */
            const addedImage = await addImage({
              variables: { file: new_photo },
            })

            console.log(addedImage)

            newValues.photo = get(addedImage, "data.addImage.compressed")
          }

          const updated = await updateCourse({
            variables: { ...newValues, id: undefined },
          })

          await Promise.all(
            (values.course_translations || []).map(t => {
              if (t.id) {
                return updateCourseTranslation({
                  variables: { ...t, course: values.id },
                })
              } else {
                return addCourseTranslation({
                  variables: { ...t, course: values.id },
                })
              }
            }),
          )

          const removedTranslationIds = pullAll(
            initialTranslationIds,
            (values.course_translations || []).map(t => t.id),
          )
          await Promise.all(
            removedTranslationIds.map(id =>
              deleteCourseTranslation({ variables: { id } }),
            ),
          )

          if (values.new_photo) {
            setFieldValue("photo", updated.data.updateCourse.photo)
            setFieldValue("new_photo", undefined)
          }
        } else {
          const added = await addCourse({
            variables: { ...values, slug: values.new_slug },
          })
          await Promise.all(
            (values.course_translations || []).map(t => {
              return addCourseTranslation({
                variables: { ...t, course: added.data.addCourse.id },
              })
            }),
          )

          if (values.new_photo) {
            setFieldValue("photo", added.data.addCourse.photo)
            setFieldValue("new_photo", undefined)
          }
        }

        setSubmitting(false)
      }}
      render={renderForm}
    />
  )
}

export default CourseEditForm
