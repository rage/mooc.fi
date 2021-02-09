import styled from "@emotion/styled"
import Button from "@material-ui/core/Button"

export const ButtonWithPaddingAndMargin = styled(Button)<{ color?: string }>`
  margin: 0.5rem;
  color: ${({ color }) =>
    color === "secondary"
      ? "#4e4637"
      : color === "primary"
      ? "#FFFFFF"
      : color || "#000000"};
  font-size: 18px;
  padding: 0.5em;
`
