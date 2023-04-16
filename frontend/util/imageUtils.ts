import {
  imageConfigDefault,
  ImageLoaderPropsWithConfig,
} from "next/dist/shared/lib/image-config"
import defaultLoader from "next/dist/shared/lib/image-loader"
import { ImageLoader, ImageProps } from "next/image"

import { ImageCoreFieldsFragment } from "/graphql/generated"

export function isStaticRequire(src?: ImageProps["src"]) {
  return (src as any)?.default !== undefined
}
export function isStaticImageData(src?: ImageProps["src"]) {
  return (src as any)?.src !== undefined
}

export function isStaticImport(
  src?: ImageProps["src"],
): src is Exclude<ImageProps["src"], string> {
  return (
    typeof src === "object" && (isStaticRequire(src) || isStaticImageData(src))
  )
}

export const isBase64 = (src?: ImageProps["src"]): boolean => {
  if (isStaticImport(src)) {
    return false
  }
  return (src ?? "").indexOf("base64") >= 0
}

export const addDomain = (file?: string | null): string => {
  if (!file) {
    return ""
  }
  if (!isBase64(file)) {
    return `https://images.mooc.fi/${file}`
  }
  return file
}

const mimetypes: { [key: string]: string } = {
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
}

export const mime = (filename?: string): string => {
  const { length: l, [l - 1]: type } = (filename ?? "").split(".")

  return mimetypes[type] ?? mimetypes.jpg
}

export const imageLoader = (
  image?: ImageCoreFieldsFragment,
): ImageLoader | undefined => {
  if (!image) {
    return
  }

  const { original_mimetype, original } = image
  const isSvg = original_mimetype === mimetypes["svg"]
  const isWebp = original_mimetype === mimetypes["webp"]
  const isBase64 = original.startsWith("base64")
  if (isBase64 || isSvg || isWebp) {
    return ((props: ImageLoaderPropsWithConfig) => {
      if (isSvg || isBase64) {
        return addDomain(image.original)
      }

      return defaultLoader({
        ...props,
        config: props.config || imageConfigDefault,
        src: addDomain(image.original),
      })
    }) as ImageLoader
  }

  return ((props: ImageLoaderPropsWithConfig) => {
    const { quality, width } = props
    let _src = addDomain(image.uncompressed)
    if ((quality ?? 75) > 75) {
      _src = addDomain(image.original)
    } else if (width <= 250) {
      _src = addDomain(image.compressed)
    }
    return defaultLoader({
      ...props,
      config: props.config || imageConfigDefault,
      src: _src,
    })
  }) as ImageLoader
}
