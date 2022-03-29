import EmailSubscribe from "/components/Home/EmailSubscribe"
import CourseList from "/components/NewLayout/CourseList"
import Hero from "/components/NewLayout/Hero"
import Modules from "/components/NewLayout/Modules"
import News from "/components/NewLayout/News"
import SelectedCourses from "/components/NewLayout/SelectedCourses"

import styled from "@emotion/styled"

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
      <SelectedCourses />
      <Modules />
      <CourseList />
      <EmailSubscribe />
    </HomeContainer>
  )
}

export default Home
