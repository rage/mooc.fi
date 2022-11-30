import { styled } from "@mui/material/styles"

import Catalogue from "/components/NewLayout/Courses/Catalogue"

const Container = styled("div")`
  display: grid;
  justify-content: center;
`

function Courses() {
  return (
    <Container>
      <Catalogue />
    </Container>
  )
}

export default Courses
