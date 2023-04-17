import Image from "next/image"

import { styled } from "@mui/material/styles"

export const BackgroundImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
`

export const FullCoverTextBackground = styled("div")`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  display: flex;
  flex-direction: column;
`

export const CourseImageBase = styled("div")`
  height: 230px;
  width: 100%;
`
