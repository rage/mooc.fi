import React, { useState, useEffect } from "react"
import { Grid, FormControlLabel, MenuItem, Paper, Button, LinearProgress } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Formik, Field, Form } from "formik"
import {
  fieldToTextField,
  TextField,
  TextFieldProps,
  SimpleFileUpload,
  Select,
  Checkbox,
} from "formik-material-ui"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      marginTop: "0.7em",
      marginBottom: "0.7em",
    },
  }),
)

const Thumbnail = ({ file }) => {
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState<any>(undefined)

  useEffect(() => {
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      console.log('prööt')
      setLoading(false)
      setImage(reader.result)
    }

    reader.readAsDataURL(file)
  }, [file, loading, image])

  if (loading || !image) {
    return null
  }

  return (
    <img
      src={image}
      height={250}
    />
  )
}

const statuses = [
  {
    value: 'Upcoming',
    label: 'Upcoming'
  }
]

const renderForm = ({ submitForm, isSubmitting, values, setFieldValue }) => (
  <Form> 
    <Field
      name="name"
      type="text"
      label="Name"
      fullWidth
      component={TextField}
    />
    <br />
    <Field
      name="slug"
      type="text"
      label="slug"
      fullWidth
      component={TextField}
    />
    <Field 
      label="promote" 
      type="checkbox" 
      name="promote" 
      fullWidth
      component={Checkbox} 
    />
    <Field
      name="photo"
      type="file"
      label="photo"
      fullWidth
      component={SimpleFileUpload}
      onChange={(event) => setFieldValue("photo", event.currentTarget.files[0])}
    />
    <Field
      name="status"
      type="text"
      label="status"
      fullWidth
      component={Select}
    >
      {statuses.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem> 
      ))}
    </Field>
    <Thumbnail file={values.photo} />
    {isSubmitting && <LinearProgress />}
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

const CourseEditForm = ({ course }) => {
  const classes = useStyles()

  return (
    <section>
      <Paper elevation={1} spacing={2}>      
        <Formik
          initialValues = {{
            name: '',
            slug: '',
            photo: undefined,
            start_point: false,
            promote: false,
            status: 'Upcoming',
            study_module: null
          }}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submitted', JSON.stringify(values))
            setSubmitting(false)
          }}
          render={renderForm}
        />
      </Paper>
    </section>
  )
}

export default CourseEditForm