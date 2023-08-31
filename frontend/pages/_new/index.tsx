import Background from "components/NewLayout/Background"

import { styled } from "@mui/material/styles"

import FrontpageHero from "/components/NewLayout/Frontpage/FrontpageHero"
import Hype from "/components/NewLayout/Frontpage/Hype"
import { ModuleNavigation } from "/components/NewLayout/Frontpage/Modules"
// import News from "/components/NewLayout/Frontpage/News"
import SelectedCourses from "/components/NewLayout/Frontpage/SelectedCourses"

const HomeContainer = styled("div")`
  /**/
`

const Home = () => {
  return (
    <HomeContainer className="main_front_page">
      <Background />
      <FrontpageHero />
      {/*<News />*/}
      <Hype />
      <SelectedCourses />
      <ModuleNavigation />
    </HomeContainer>
  )
}

export default Home
