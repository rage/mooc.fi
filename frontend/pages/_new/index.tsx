import styled from "@emotion/styled"

import EmailSubscribe from "/components/Home/EmailSubscribe"
import Hero from "/components/NewLayout/Frontpage/Hero"
import Hype from "/components/NewLayout/Frontpage/Hype"
import ModuleNavigation from "/components/NewLayout/Frontpage/Modules"
import News from "/components/NewLayout/Frontpage/News"
import SelectedCourses from "/components/NewLayout/Frontpage/SelectedCourses"

const HomeContainer = styled.div`
  * + * {
    margin: 0;
  }
`

const Home = () => {
  return (
    <HomeContainer>
      <Hero />
      <News />
      <Hype />
      <SelectedCourses />
      <ModuleNavigation />
      <EmailSubscribe />
    </HomeContainer>
  )
}

export default Home
