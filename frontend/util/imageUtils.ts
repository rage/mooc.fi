import { ImageLoader } from "next/image"

import { ImageCoreFieldsFragment } from "/graphql/generated"

export const addDomain = (file?: string | null): string => {
  if (!file) {
    return ""
  }
  if (file.indexOf("base64") < 0) {
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

export const imageLoader = (image?: ImageCoreFieldsFragment): ImageLoader => {
  if (!image) {
    return ({ src, width, quality }) => `${src}?w=${width}&q=${quality ?? 75}`
  }

  const { original_mimetype, original } = image

  if (
    original.startsWith("base64") ||
    [mimetypes["svg"], mimetypes["webp"]].includes(original_mimetype)
  ) {
    return ({ width, quality }) =>
      `${addDomain(image.original)}?w=${width}&q=${quality ?? 75}`
  }

  return ({ width, quality }) => {
    let src = addDomain(image.uncompressed)
    if ((quality ?? 0) > 90) {
      src = addDomain(image.original)
    } else if (width <= 250) {
      src = addDomain(image.compressed)
    }
    return `${src}?w=${width}&q=${quality ?? 75}`
  }
}
