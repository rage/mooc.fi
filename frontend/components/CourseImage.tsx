import React from "react"

import { ImageProps } from "next/image"

import { Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import LoaderImage from "./LoaderImage"

import { ImageCoreFieldsFragment } from "/graphql/generated"

const ImageComponentBase = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const PlaceholderComponent = styled("div")`
  ${ImageComponentBase}
  background-color: #F0F0F0;
  display: flex;
  justify-content: center;
  align-items: center;
`
interface CourseImageProps extends Omit<ImageProps, "src"> {
  photo?: ImageCoreFieldsFragment | null
  src?: ImageProps["src"]
}

const CourseImage = React.memo((props: CourseImageProps) => {
  const { photo, ...rest } = props

  return (
    <>
      {photo ? (
        <LoaderImage
          image={photo}
          sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
