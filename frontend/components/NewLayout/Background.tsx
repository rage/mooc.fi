import { styled } from "@mui/material/styles"

import backgroundPattern from "/public/images/new/background/backgroundPattern2.svg"

const Background = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -10;
  background: #fefefe;
  background-image: url(${backgroundPattern.src});
`

export default Background
