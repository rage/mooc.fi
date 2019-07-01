import React, { useState, useEffect } from "react"
import {
  Grid,
  InputLabel,
  FormControlLabel,
  MenuItem,
  Paper,
  Button,
  LinearProgress,
} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Formik, Field, Form, FormikProps } from "formik"
import {
  fieldToTextField,
  TextField,
  TextFieldProps,
  SimpleFileUpload,
  Select,
  Checkbox,
} from "formik-material-ui"
import { gql } from "apollo-boost"
import { useQuery } from "react-apollo-hooks"
import { default as firebase } from "../../lib/firebase"
import uuid from "../../../util/uuid"
import * as Yup from "yup"

export const CourseQuery = gql`
  query CourseDetails($slug: String) {
    course(slug: $slug) {
      id
      name
      slug
      photo
      promote
      start_point
      status
    }
  }
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      marginTop: "0.7em",
      marginBottom: "0.7em",
    },
    paper: {
      padding: "1em",
    },
  }),
)

const Thumbnail = ({ file }) => {
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

const CourseEditSchema = Yup.object().shape({
  name: Yup.string().required("required"),
  slug: Yup.string().required("required"),
})

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
    <InputLabel>Status</InputLabel>
    <Field
      name="status"
      type="text"
      label="Status"
      component={Select}
      fullWidth
    >
      {statuses.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Field>
    <Field
      name="photo"
      type="file"
      label="Photo"
      fullWidth
      component={SimpleFileUpload}
      onChange={event => setFieldValue("photo", event.currentTarget.files[0])}
    />
    <Thumbnail file={values.photo} />
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

const CourseEditForm = ({ slug }) => {
  const [storageRef, setStorageRef] = useState(null)
  const [course, setCourse] = useState(null)

  const classes = useStyles()

  const { data, loading, error } = useQuery(CourseQuery, {
    variables: { slug: slug },
  })

  useEffect(() => {
    if (!firebase) {
      return
    }

    const storage = firebase.storage()
    setStorageRef(storage.ref())
  }, [firebase])

  useEffect(() => {
    if (loading || !data.course) {
      return
    }

    setCourse(data.course)
  }, [data, loading])

  if (!storageRef) {
    return null
  }

  return (
    <section>
      <Paper elevation={1} className={classes.paper}>
        <Formik
          initialValues={
            course || {
              name: "",
              slug: "",
              photo: undefined,
              start_point: false,
              promote: false,
              status: "Upcoming",
              study_module: null,
            }
          }
          validationSchema={CourseEditSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log("submitted", JSON.stringify(values))
            if (values.photo) {
              const imageRef = storageRef
                .child(`images/${uuid()}-${values.photo.name}`)
                .put(values.photo)
                .then(snapshot => {
                  console.log("uploaded and got", snapshot)
                })
            }
            setSubmitting(false)
          }}
          render={renderForm}
        />
      </Paper>
    </section>
  )
}

export default CourseEditForm
