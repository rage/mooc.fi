const baseFontSize = 16 // px
const rem = (px: number) => `${px / baseFontSize}rem`

export const fontSize = (fontSize: number, lineHeight?: number) => {
  return `
    font-size: ${rem(fontSize)};
    ${lineHeight ? `line-height: ${lineHeight / fontSize};` : ""}
  `
}
