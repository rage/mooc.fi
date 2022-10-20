import { styled } from "@mui/material/styles"

import Catalogue from "/components/NewLayout/Courses/Catalogue"
import HeroSection from "/components/NewLayout/Courses/HeroSection"

const Container = styled("div")`
  display: grid;
  justify-content: center;
`

function Courses() {
  return (
    <Container>
      <HeroSection />
      <Catalogue />
    </Container>
  )
}

export default Courses
