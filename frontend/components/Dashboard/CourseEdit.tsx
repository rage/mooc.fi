import React, { useState, useEffect } from "react"
import { Paper } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import CourseEditForm from "./CourseEditForm"
import { useMutation, useQuery } from "react-apollo-hooks"
import { gql } from "apollo-boost"
import { CourseStatus } from "../../__generated__/globalTypes"
import { CourseTranslationFormValues } from "./CourseTranslationEditForm"
import { addImage_addImage as Image } from "./__generated__/addImage"
import { updateCourseVariables as Course } from "./__generated__/updateCourse"
import Next18next from "../../i18n"

export const AddCourseMutation = gql`
  mutation addCourse(
    $name: String
    $slug: String
    $photo: ID
    $promote: Boolean
    $start_point: Boolean
    $status: CourseStatus
  ) {
    addCourse(
      name: $name
      slug: $slug
      photo: $photo
      promote: $promote
      start_point: $start_point
      status: $status
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

export const AddCourseTranslationMutation = gql`
  mutation addCourseTranslation(
    $language: String!
    $name: String!
    $description: String
    $link: String
    $course: ID!
  ) {
    addCourseTranslation(
      language: $language
      name: $name
      description: $description
      link: $link
      course: $course
    ) {
      id
    }
  }
`

export const UpdateCourseTranslationMutation = gql`
  mutation updateCourseTranslation(
    $id: ID!
    $language: String!
    $name: String!
    $description: String
    $link: String
    $course: ID
  ) {
    updateCourseTranslation(
      id: $id
      language: $language
      name: $name
      description: $description
      link: $link
      course: $course
    ) {
      id
    }
  }
`

export const DeleteCourseTranslationMutation = gql`
  mutation deleteCourseTranslation($id: ID!) {
    deleteCourseTranslation(id: $id) {
      id
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

interface CourseFormValues extends Course {
  new_photo: undefined | File
  new_slug: string
  thumbnail?: string
  course_translations: (CourseTranslationFormValues | undefined)[]
  study_module: string | null | undefined
}

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
  const addCourseTranslation = useMutation(AddCourseTranslationMutation)
  const updateCourseTranslation = useMutation(UpdateCourseTranslationMutation)
  const deleteCourseTranslation = useMutation(DeleteCourseTranslationMutation)
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
          addCourseTranslation={addCourseTranslation}
          updateCourseTranslation={updateCourseTranslation}
          deleteCourseTranslation={deleteCourseTranslation}
          uploadImage={uploadImage}
          //onSubmit={onSubmit}
        />
      </Paper>
    </section>
  )
}

export default CourseEdit
