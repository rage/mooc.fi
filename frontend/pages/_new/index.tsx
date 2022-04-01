import EmailSubscribe from "/components/Home/EmailSubscribe"
import CourseList from "/components/NewLayout/Frontpage/CourseList"
import Hero from "/components/NewLayout/Frontpage/Hero"
import Modules from "/components/NewLayout/Frontpage/Modules"
import News from "/components/NewLayout/Frontpage/News"
import SelectedCourses from "/components/NewLayout/Frontpage/SelectedCourses"

import styled from "@emotion/styled"
import Hype from "/components/NewLayout/Frontpage/Hype"

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
      <Modules />
      <CourseList />
      <EmailSubscribe />
    </HomeContainer>
  )
}

export default Home
