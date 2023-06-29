import Image, { ImageProps } from "next/image"

import { styled } from "@mui/material/styles"

import { isNullish } from "/util/guards"
import { addDomain, isBase64 } from "/util/imageUtils"

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
  if (isNullish(src) && isNullish(image)) {
    throw new Error("LoaderImage: src or image must be provided")
  }
  const _src = src ?? addDomain(image?.original)
  return (
    <ImageBase
      src={src ?? addDomain(image?.original)}
      {...(isBase64(_src) && { unoptimized: true })}
      {...rest}
    />
  )
}
