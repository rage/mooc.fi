export const stripDiacritics = (text: string) =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "")
