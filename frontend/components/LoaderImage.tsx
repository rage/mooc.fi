import Image, { ImageProps } from "next/image"

import { styled } from "@mui/material/styles"

import { addDomain, imageLoader } from "/util/imageUtils"

import { ImageCoreFieldsFragment } from "/graphql/generated"

type LoaderImageProps = Omit<ImageProps, "src"> & {
  src?: ImageProps["src"]
  image?: ImageCoreFieldsFragment
}

const ImageBase = styled(Image)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  object-fit: cover;
`

export default function LoaderImage({ src, image, ...rest }: LoaderImageProps) {
  return (
    <ImageBase
      {...(src ? { src } : { src: addDomain(image?.uncompressed) })}
      {...(image && { loader: imageLoader(image) })}
      {...rest}
    />
  )
}
