import Background from "components/NewLayout/Background"

import { styled } from "@mui/material/styles"

import { StudyModuleHero, StudyModuleList } from "/components/NewLayout/Modules"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

function StudyModules() {
  useBreadcrumbs([
    {
      translation: "studyModules",
      href: "/study-modules",
    },
  ])

  return (
    <Container>
      <Background />
      <StudyModuleHero />
      <StudyModuleList />
    </Container>
  )
}

export default StudyModules
