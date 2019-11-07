import styled from "styled-components"
import Typography from "@material-ui/core/Typography"

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
`
export const SubtitleNoBackground = styled(Typography)`
  padding-bottom: 1em;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 2em;
`

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
`

interface TitleProps {
  fontcolor: string
  titlebackground: string
}

export const H2Background = styled(Typography)<TitleProps>`
  margin: 5rem auto 1rem auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: table;

  ${props =>
    ` background-color: ${props.titlebackground}; color: ${props.fontcolor};`}
`
export const SubtitleBackground = styled(Typography)`
  margin: 0rem auto 3rem auto;
  padding: 1rem;
  display: table;
  background-color: white;
`

export const CardTitle = styled(Typography)`
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  color: black;
`
export const CardSubtitle = styled(Typography)`
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  color: gray;
`
