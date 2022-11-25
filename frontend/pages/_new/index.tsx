import { styled } from "@mui/material/styles"

import EmailSubscribe from "/components/Home/EmailSubscribe"
import CourseList from "/components/NewLayout/Frontpage/CourseList"
import Hero from "/components/NewLayout/Frontpage/Hero"
import Hype from "/components/NewLayout/Frontpage/Hype"
import Modules from "/components/NewLayout/Frontpage/Modules/Modules"
import News from "/components/NewLayout/Frontpage/News"
import SelectedCourses from "/components/NewLayout/Frontpage/SelectedCourses"

const HomeContainer = styled("div")`
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
