import { styled } from "@mui/material/styles"

// Renders as a <span>, not the default <div>: this is used inside link text, and a <div> inside
// an <a> inside a <p> is invalid HTML that throws a hydration error.
const VisuallyHidden = styled("span")`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export default VisuallyHidden
