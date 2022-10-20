import styled from "@emotion/styled"

import Catalogue from "/components/Courses/Catalogue"
import HeroSection from "/components/Courses/HeroSection"

const Container = styled.div`
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
