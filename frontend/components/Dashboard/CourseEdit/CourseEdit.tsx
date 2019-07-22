import React, { useState, useCallback } from "react"
import { Paper } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import CourseEditForm from "./CourseEditForm"
import { useMutation, useApolloClient } from "react-apollo-hooks"
import { addImage_addImage as Image } from "../__generated__/addImage"
import {
  AddCourseMutation,
  UpdateCourseMutation,
  DeleteCourseMutation,
  CheckSlugQuery,
  AddImageMutation,
  DeleteImageMutation,
} from "./graphql"
import { CourseFormValues, CourseTranslationFormValues } from "./types"
import courseEditSchema, { initialValues } from "./form-validation"
import { FormikActions, getIn } from "formik"
import Next18next from "../../../i18n"
import { AllCoursesQuery } from "../../../pages/courses"

const isProduction = process.env.NODE_ENV === "production"

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

const CourseEdit = ({ course }: { course: CourseFormValues }) => {
  const classes = useStyles()

  const addCourse = useMutation(AddCourseMutation, {
    refetchQueries: [{ query: AllCoursesQuery }],
  })
  const updateCourse = useMutation(UpdateCourseMutation)
  const deleteCourse = useMutation(DeleteCourseMutation, {
    refetchQueries: [{ query: AllCoursesQuery }],
  })
  const addImage = useMutation(AddImageMutation)
  const deleteImage = useMutation(DeleteImageMutation)
  const checkSlug = CheckSlugQuery

  const client = useApolloClient()

  const [submitStatus, setSubmitStatus] = useState<{
    message: String | null
    error?: boolean
  }>({ message: null })

  const _course: CourseFormValues = course
    ? {
        ...course,
        course_translations: !course.course_translations
          ? []
          : course.course_translations,
        new_slug: course.slug,
        thumbnail: course.photo ? course.photo.compressed : null,
      }
    : initialValues

  const validationSchema = courseEditSchema({
    client,
    checkSlug,
    slug: _course.slug,
  })

  const uploadImage = useCallback(
    async ({
      image,
      base64 = false,
    }: {
      image: File | undefined
      base64?: Boolean
    }): Promise<Image | null> => {
      if (!image) {
        return null
      }

      const { data, error } = await addImage({
        variables: { file: image, base64 },
      })

      if (error) {
        throw new Error("error uploading image: " + error)
      }

      if (data && data.addImage) {
        return data.addImage
      }

      return null
    },
    [],
  )

  const onSubmit = useCallback(
    async (
      values: CourseFormValues,
      { setSubmitting, setFieldValue }: FormikActions<CourseFormValues>,
    ): Promise<void> => {
      const newCourse = !values.id

      try {
        const newValues: CourseFormValues = {
          ...values,
          photo: getIn(values, "photo.id"),
        }
        const { new_photo }: { new_photo: File | undefined } = values
        const mutation = newCourse ? addCourse : updateCourse

        let deletablePhoto: Image | null = null

        if (new_photo) {
          setSubmitStatus({ message: "Uploading image..." })

          const uploadedImage: Image | null = await uploadImage({
            image: new_photo,
            base64: !isProduction,
          })

          if (uploadedImage) {
            newValues.photo = uploadedImage.id
            setFieldValue("new_photo", null)
            setFieldValue("thumbnail", uploadedImage.compressed)

            if (_course.photo) {
              deletablePhoto = _course.photo
            }

            setFieldValue("photo", uploadedImage.id)
          }
        } else if (_course.photo && !values.photo) {
          // delete existing photo
          newValues.photo = undefined
          deletablePhoto = _course.photo
        }

        if (deletablePhoto) {
          // TODO? does return boolean on delete status
          setSubmitStatus({ message: "Deleting previous image..." })
          await deleteImage({ variables: { id: deletablePhoto.id } })
        }

        setSubmitStatus({ message: "Saving..." })
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

        setSubmitStatus({ message: null })
        setSubmitting(false)
        Next18next.Router.push("/courses")
      } catch (err) {
        setSubmitStatus({ message: err.message, error: true })
        console.error(err)
        setSubmitting(false)
      }
    },
    [],
  )

  const onDelete = useCallback(async (values: CourseFormValues) => {
    if (values.id) {
      if (values.photo) {
        await deleteImage({ variables: { id: values.photo.id } })
      }

      await deleteCourse({ variables: { id: values.id } })
      Next18next.Router.push("/courses")
    }
  }, [])

  const onCancel = useCallback(() => {
    Next18next.Router.push("/courses")
  }, [])

  return (
    <section>
      <Paper elevation={1} className={classes.paper}>
        <CourseEditForm
          course={_course}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          onCancel={onCancel}
          onDelete={onDelete}
        />
        {submitStatus && submitStatus.message ? (
          <p style={submitStatus.error ? { color: "red" } : {}}>
            {submitStatus.error ? "Error submitting: " : null}
            <b>{submitStatus.message}</b>
          </p>
        ) : null}
      </Paper>
    </section>
  )
}

export default CourseEdit
