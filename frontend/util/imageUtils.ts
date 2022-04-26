export const addDomain = (file?: string | null): string =>
  file
    ? file.indexOf("base64") < 0
      ? `https://images.mooc.fi/${file}`
      : file
    : ""

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
