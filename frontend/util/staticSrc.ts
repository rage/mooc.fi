import { ImageProps } from "next/image"

export const staticSrc = (src: ImageProps["src"], path = "/images/") => {
  if (typeof src === "string") {
    if (src.startsWith("/_next") || src.startsWith(path)) {
      return src
    }

    return `${path}${src}`
  }

  return src
}
