import { styled } from "@mui/material/styles"

import FrontpageHero from "/components/NewLayout/Frontpage/FrontpageHero"
import Hype from "/components/NewLayout/Frontpage/Hype"
import { ModuleNavigation } from "/components/NewLayout/Frontpage/Modules"
// import News from "/components/NewLayout/Frontpage/News"
import SelectedCourses from "/components/NewLayout/Frontpage/SelectedCourses"

// import UkraineInfo from "/components/NewLayout/Frontpage/UkraineInfo"

const HomeContainer = styled("div")`
  display: flex;
  justify-content: center;
`

const ContentContainer = styled("div")`
  max-width: 1920px;
`

const Home = () => {
  return (
    <HomeContainer className="main_front_page">
      <ContentContainer>
        <FrontpageHero />
        {/*<News />*/}
        <Hype />
        {/* <UkraineInfo /> */}
        <SelectedCourses />
        <ModuleNavigation />
      </ContentContainer>
    </HomeContainer>
  )
}

export default Home
