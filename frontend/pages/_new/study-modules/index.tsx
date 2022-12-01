import { styled } from "@mui/material/styles"

import { StudyModuleHero, StudyModuleList } from "/components/NewLayout/Modules"

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

function StudyModules() {
  return (
    <Container>
      <StudyModuleHero />
      <StudyModuleList />
    </Container>
  )
}

export default StudyModules
