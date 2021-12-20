import styled from "@emotion/styled"
import Typography from "@mui/material/Typography"

export const H1NoBackground = styled(Typography)<any>`
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
export const SubtitleNoBackground = styled(Typography)<any>`
  padding-bottom: 1em;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 2em;
`

export const H1Background = styled(Typography)<any>`
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
  component: string
}

export const H2Background = styled(Typography)<TitleProps>`
  margin: 5rem auto 1rem auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  display: table;
  font-family: Roboto;
  font-weight: 550;

  ${(props) =>
    ` background-color: ${props.titlebackground}; color: ${props.fontcolor};`}
`

export const H2NoBackground = styled(Typography)<any>`
  margin: 3rem auto 0.7rem auto;
  padding-left: 1rem;
  padding-right: 1rem;
  display: table;
  font-family: Roboto;
  font-weight: 550;
  font-size: 37px;
  line-height: 58px;
`
interface SubTitleProps {
  fontcolor?: string
  component: string
}
export const SubtitleBackground = styled(Typography)<SubTitleProps>`
  margin: 0rem auto 3rem auto;
  padding: 1rem;
  display: table;
  background-color: white;
  font-family: Roboto;
  font-weight: 450;
  ${(props) => `color: ${props.fontcolor ? props.fontcolor : `black`};`}
`

export const CardTitle = styled(Typography)<any>`
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  color: black;
`
export const CardSubtitle = styled(Typography)<any>`
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  color: gray;
  font-family: "Open Sans Condensed", sans-serif !important;
`
