import styled from "styled-components"
import Typography from "@material-ui/core/Typography"

export const HOneNoBackground = styled(Typography)`
  padding-top: 0.7em;
  padding-bottom: 0.7em;
  padding-left: 1.5rem;
  padding-right: 1.5rem;

  @media (min-width: 600px) {
    padding-top: 1em;
    padding-bottom: 1em;
  }

  @media (min-width: 960px) {
    padding-left: 1em;
    padding-right: 1em;
  }
`
