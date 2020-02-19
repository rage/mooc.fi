import styled from "styled-components"
import Button from "@material-ui/core/Button"

export const ButtonWithPaddingAndMargin = styled(Button)<{ color?: string }>`
  margin: 0.5rem;
  color: ${({ color }) => (color === "secondary" ? "#4e4637" : "#FFFFFF")};
  font-size: 18px;
  padding: 0.5em;
`
