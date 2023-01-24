import React from "react"

import Image from "next/image"

import { Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { addDomain } from "/util/imageUtils"

import { ImageCoreFieldsFragment } from "/graphql/generated"

const ImageComponentBase = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ImageComponent = styled(Image)`
  ${ImageComponentBase}
`

const PlaceholderComponent = styled("div")`
  ${ImageComponentBase}
  background-color: #F0F0F0;
  display: flex;
  justify-content: center;
  align-items: center;
`
interface CourseImageProps {
  photo?: ImageCoreFieldsFragment | null
  [k: string]: any
}

const CourseImage = React.memo((props: CourseImageProps) => {
  const { photo, ...rest } = props

  return (
    <>
      {photo ? (
        <ImageComponent
          src={addDomain(photo.uncompressed)}
          loading="lazy"
          alt=""
          fill
          {...rest}
        />
      ) : (
        <PlaceholderComponent>
          <Typography variant="h3">no image</Typography>
        </PlaceholderComponent>
      )}
    </>
  )
})

export default CourseImage
