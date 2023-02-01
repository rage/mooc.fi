import backgroundPattern from "public/images/backgroundPattern2.svg"

import { styled } from "@mui/material/styles"

import Catalogue from "/components/NewLayout/Courses/Catalogue"

const Container = styled("div")`
  display: grid;
  justify-content: center;
  position: relative;
`

/*
  secret project gray palette
  F5F6F7
  EBEDEE
  E2E4E6
  D8D8DD
  CED2D5
  C4C9CD
  BEC3C7
*/

const Background = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: #f5f6f7;
  background-image: url(${backgroundPattern.src});
`

function Courses() {
  return (
    <Container>
      <Background />
      <Catalogue />
    </Container>
  )
}

export default Courses
