import React from "react"
import styled from "styled-components"
import { addDomain } from "../util/imageUtils"

interface Image {
  id: any
  /*   name: string | null
  original: string
  original_mimetype: string */
  compressed: string | null
  /*   compressed_mimetype: string */
  uncompressed: string | null
  /*   uncompressed_mimetype: string
  encoding: string | null
  default: boolean | null */
}

const ImageComponent = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

interface CourseImageProps {
  photo?: Image | null
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
      <ImageComponent src={addDomain(photo.compressed)} {...rest} />
    </picture>
  )
})

export default CourseImage
