import React, { useCallback } from "react"
import { Paper } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import CourseEditForm from "./CourseEditForm"
import { useMutation, useApolloClient } from "react-apollo-hooks"
import { addImage_addImage as Image } from "../../../static/types/addImage"
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
import get from "lodash/get"

const isProduction = process.env.NODE_ENV === "production"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      marginTop: "0.7em",
      marginBottom: "0.7em",
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

  const _course: CourseFormValues = course
    ? {
        ...course,
        course_translations: (course.course_translations || []).map(c => ({
          ...c,
          open_university_course_code: get(
            (course.open_university_registration_links || []).find(
              l => l.language === c.language,
            ),
            "course_code",
          ),
        })),
        new_slug: course.slug,
        thumbnail: course.photo ? course.photo.compressed : null,
      }
    : initialValues

  const validationSchema = courseEditSchema({
    client,
    checkSlug,
    initialSlug: course.slug && course.slug !== "" ? course.slug : null,
  })

  const uploadImage = useCallback(
    async ({
      image,
      base64 = false,
    }: {
      image: File | undefined
      base64?: boolean
    }): Promise<Image | null> => {
      if (!image) {
        throw new Error("no image to upload!")
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

      throw new Error("didn't get an image in reply from server")
    },
    [],
  )

  const onSubmit = useCallback(
    async (
      values: CourseFormValues,
      {
        setSubmitting,
        setFieldValue,
        setStatus,
      }: FormikActions<CourseFormValues>,
    ): Promise<void> => {
      const newCourse = !values.id

      const newValues: CourseFormValues = {
        ...values,
        photo: getIn(values, "photo.id"),
      }
      const { new_photo }: { new_photo: File | undefined } = values
      const courseMutation = newCourse ? addCourse : updateCourse

      try {
        let deletablePhoto: Image | null = null

        if (new_photo) {
          setStatus({ message: "Uploading image..." })

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
          setStatus({ message: "Deleting previous image..." })
          // TODO: do something with boolean return status?
          await deleteImage({ variables: { id: deletablePhoto.id } })
        }

        const courseTranslations = values.course_translations.length
          ? values.course_translations.map(
              (c: CourseTranslationFormValues) => ({
                ...c,
                open_university_course_code: undefined,
                id: !c.id || c.id === "" ? null : c.id,
                __typename: undefined,
              }),
            )
          : null

        const registrationLinks = values.course_translations.length
          ? values.course_translations
              .map((c: CourseTranslationFormValues) => {
                if (
                  !c.open_university_course_code ||
                  c.open_university_course_code === ""
                ) {
                  return null
                }

                const prevLink = (
                  _course.open_university_registration_links || []
                ).find(l => l.language === c.language)

                if (!prevLink) {
                  return {
                    language: c.language,
                    course_code: c.open_university_course_code.trim(),
                  }
                }

                return {
                  ...prevLink,
                  course_code: c.open_university_course_code.trim(),
                  __typename: undefined,
                }
              })
              .filter(v => !!v)
          : null

        setStatus({ message: "Saving..." })
        const course = await courseMutation({
          variables: {
            ...newValues,
            id: undefined,
            slug: values.id ? values.slug : values.new_slug,
            course_translations: courseTranslations,
            open_university_registration_links: registrationLinks,
          },
        })

        setStatus({ message: null })
        setSubmitting(false)
        Next18next.Router.push("/courses")
      } catch (err) {
        setStatus({ message: err.message, error: true })
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
      <CourseEditForm
        course={_course}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    </section>
  )
}

export default CourseEdit
