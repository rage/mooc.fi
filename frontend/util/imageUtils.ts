export const addDomain = (file?: string | null): string =>
  file
    ? file.indexOf("base64") < 0
      ? `https://images.mooc.fi/${file}`
      : file
    : ""
