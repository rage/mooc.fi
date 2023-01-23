import backgroundPattern from "static/images/backgroundPattern2.svg"

import { styled } from "@mui/material/styles"

const Background = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -10;
  background: #fefefe;
  background-image: url(${backgroundPattern});
`

export default Background
