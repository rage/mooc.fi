import React from "react"
import styled from "styled-components"
import { addDomain } from "/util/imageUtils"
import { AllCourses_courses_photo } from "/static/types/generated/AllCourses"

const ImageComponent = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

interface CourseImageProps {
  photo?: AllCourses_courses_photo | null
  [k: string]: any
}

const CourseImage = React.memo((props: CourseImageProps) => {
  const { photo, ...rest } = props

  if (!photo) {
    return null
  }

  return (
    <picture>
      <source srcSet={addDomain(photo.compressed)} type="image/webp" />
      <source srcSet={addDomain(photo.uncompressed)} type="image/png" />
      <ImageComponent src={addDomain(photo.uncompressed)} {...rest} alt="" />
    </picture>
  )
})

export default CourseImage
