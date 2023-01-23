import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"

export const ButtonWithPaddingAndMargin = styled(Button, {
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>`
  margin: 0.5rem;
  color: ${({ color }) =>
    color === "secondary"
      ? "#4e4637"
      : color === "primary"
      ? "#FFFFFF"
      : color ?? "#000000"};
  font-size: 18px;
  padding: 0.5em;
` as typeof Button
