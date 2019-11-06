import styled from "styled-components"
import Typography from "@material-ui/core/Typography"

export const HOneNoBackground = styled(Typography)`
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

export const HOneBackground = styled(Typography)`
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

export const HTwoBackground = styled(Typography)``
