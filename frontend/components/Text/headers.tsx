import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

export const H1NoBackground = styled(Typography)<{
  component?: React.ElementType
}>`
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
`

export const SubtitleNoBackground = styled(Typography)<{
  component?: React.ElementType
}>`
  padding-bottom: 1em;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 2em;
`

export const H1Background = styled(Typography)<{
  component?: React.ElementType
}>`
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
`
interface TitleProps {
  fontcolor: string
  titlebackground: string
}

export const H2Background = styled(Typography, {
  shouldForwardProp: (prop) =>
    prop !== "fontcolor" && prop !== "titlebackground",
})<TitleProps & { component?: React.ElementType }>`
  margin: 5rem auto 1rem auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  display: table;
  font-family: var(--roboto-font);
  font-weight: 550;

  ${(props) =>
    ` background-color: ${props.titlebackground}; color: ${props.fontcolor};`}
`

export const H2NoBackground = styled(Typography)<{
  component?: React.ElementType
}>`
  margin: 3rem auto 0.7rem auto;
  padding-left: 1rem;
  padding-right: 1rem;
  display: table;
  font-family: var(--roboto-font);
  font-weight: 550;
  font-size: 37px;
  line-height: 58px;
`
interface SubTitleProps {
  fontcolor?: string
}

export const SubtitleBackground = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "fontcolor",
})<SubTitleProps & { component: React.ElementType }>`
  margin: 0rem auto 3rem auto;
  padding: 1rem;
  display: table;
  background-color: white;
  font-family: var(--roboto-font);
  font-weight: 450;
  ${(props) => `color: ${props.fontcolor ?? "black"};`}
`

export const CardTitle = styled(Typography)<{ component?: React.ElementType }>`
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  color: black;
`

export const CardSubtitle = styled(Typography)<{
  component?: React.ElementType
}>`
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  color: gray;
  font-family: var(--open-sans-condensed-font), sans-serif !important;
`
