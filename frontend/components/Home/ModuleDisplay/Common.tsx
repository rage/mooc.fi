import styled from "@emotion/styled"

export const CenteredContent = styled.div`
  width: 80%;
  margin: auto;
  @supports (display: grid) {
    display: grid;
    grid-gap: 15px;
    align-content: space-around;
    grid-template-columns: 1fr;

    @media only screen and (min-width: 1200px) {
      grid-template-columns: 45% 55%;
      grid-auto-rows: 1fr;
      width: 90%;
    }
  }
`
