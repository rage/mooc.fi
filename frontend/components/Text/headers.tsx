import { BoxProps, Typography, TypographyProps } from "@mui/material"
import { styled } from "@mui/material/styles"

export const H1NoBackground = styled(Typography)`
  padding-top: 0.7em;
  padding-bottom: 0.7em;
  padding-left: 1.5rem;
  padding-right: 1.5rem;

  @media (min-width: 600px) {
    padding-top: 1em;
    padding-bottom: 0.7em;
  }

  @media (min-width: 960px) {
    padding-left: 1em;
    padding-right: 1em;
  }
` as typeof Typography

export const SubtitleNoBackground = styled(Typography)`
  padding-bottom: 1em;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 2em;
` as typeof Typography

export const H1Background = styled(Typography)`
  margin-left: auto;
  margin-right: auto;
  padding-top: 0.7em;
  padding-bottom: 0.7em;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  margin-top: 1em;
  margin-bottom: 0.7em;
  background-color: white;
  width: 45%;
` as typeof Typography

interface TitleProps {
  fontcolor: string
  titlebackground: string
}

export const H2Background = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== "fontcolor" && prop !== "titlebackground",
})<TitleProps & TypographyProps & BoxProps>`
  margin: 5rem auto 1rem auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  display: table;
  font-family: var(--body-font);
  font-weight: 550;

  ${(props) =>
    ` background-color: ${props.titlebackground}; color: ${props.fontcolor};`}
`

export const H2NoBackground = styled(Typography)`
  margin: 3rem auto 0.7rem auto;
  padding-left: 1rem;
  padding-right: 1rem;
  display: table;
  font-family: var(--body-font);
  font-weight: 550;
  font-size: 37px;
  line-height: 58px;
` as typeof Typography

interface SubTitleProps {
  fontcolor?: string
}

export const SubtitleBackground = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "fontcolor",
})<SubTitleProps & TypographyProps & BoxProps>`
  margin: 0rem auto 3rem auto;
  padding: 1rem;
  display: table;
  background-color: white;
  font-family: var(--body-font);
  font-weight: 450;
  ${(props) => `color: ${props.fontcolor ?? "black"};`}
`

export const CardTitle = styled(Typography)`
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  color: black;
` as typeof Typography

export const CardSubtitle = styled(Typography)(
  ({ theme }) => `
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  color: gray;
  font-family: ${theme.typography.subtitle1.fontFamily}; 
  font-stretch: ${theme.typography.subtitle1.fontStretch};
`,
) as typeof Typography
