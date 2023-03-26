export const convertDotNotation = (name: string) =>
  name.replace(/\.(\d+)\./, "[$1].")
