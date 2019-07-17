import React, { useState, useEffect } from "react"
import { Paper } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import CourseEditForm from "./CourseEditForm"
import { useMutation, useQuery } from "react-apollo-hooks"
import { gql } from "apollo-boost"
import { CourseStatus } from "../../__generated__/globalTypes"
import { CourseTranslationFormValues } from "./CourseTranslationEditForm"
import { addImage_addImage as Image } from "./__generated__/addImage"
import Next18next from "../../i18n"

export const AddCourseMutation = gql`
  mutation addCourse(
    $name: String
    $slug: String
    $photo: ID
    $promote: Boolean
    $start_point: Boolean
    $status: CourseStatus
    $course_translations: [CourseTranslationCreateInput!]
  ) {
    addCourse(
      name: $name
      slug: $slug
      photo: $photo
      promote: $promote
      start_point: $start_point
      status: $status
      course_translations: $course_translations
    ) {
      id
      slug
      photo {
        id
        compressed
        compressed_mimetype
        uncompressed
        uncompressed_mimetype
      }
      course_translations {
        id
        language
        name
        description
        link
      }
    }
  }
`

export const UpdateCourseMutation = gql`
  mutation updateCourse(
    $id: ID
    $name: String
    $slug: String
    $photo: ID
    $promote: Boolean
    $start_point: Boolean
    $status: CourseStatus
    $new_slug: String
    $course_translations: [CourseTranslationWithIdInput!]
  ) {
    updateCourse(
      id: $id
      name: $name
      slug: $slug
      new_slug: $new_slug
      photo: $photo
      promote: $promote
      start_point: $start_point
      status: $status
      course_translations: $course_translations
    ) {
      id
      slug
      photo {
        id
        compressed
        compressed_mimetype
        uncompressed
        uncompressed_mimetype
      }
      course_translations {
        id
        language
        name
        description
        link
      }
    }
  }
`

export const CheckSlugQuery = gql`
  query checkSlug($slug: String) {
    course_exists(slug: $slug)
  }
`

export const AddImageMutation = gql`
  mutation addImage($file: Upload!) {
    addImage(file: $file) {
      id
      compressed
      compressed_mimetype
      uncompressed
      uncompressed_mimetype
      encoding
      default
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

const CourseEdit = ({ course }: { course: any }) => {
  const classes = useStyles()

  const addCourse = useMutation(AddCourseMutation)
  const updateCourse = useMutation(UpdateCourseMutation)
  const addImage = useMutation(AddImageMutation)
  const checkSlug = CheckSlugQuery

  const uploadImage = async (
    image: File | undefined,
  ): Promise<Image | null> => {
    if (!image) {
      return null
    }

    const { data, error } = await addImage({ variables: { file: image } })

    console.log(data)

    if (error) {
      throw new Error("error uploading image: " + error)
    }

    if (data && data.addImage) {
      return data.addImage
    }

    return null
  }

  return (
    <section>
      <Paper elevation={1} className={classes.paper}>
        <CourseEditForm
          course={course}
          checkSlug={checkSlug}
          addCourse={addCourse}
          updateCourse={updateCourse}
          uploadImage={uploadImage}
        />
      </Paper>
    </section>
  )
}

export default CourseEdit
