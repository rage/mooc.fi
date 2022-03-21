import CourseAndModuleList from "/components/Home/CourseAndModuleList"
import EmailSubscribe from "/components/Home/EmailSubscribe"
import ExplanationHero from "/components/Home/ExplanationHero"
import NaviCardList from "/components/Home/NaviCardList"

const Home = () => {
  return (
    <div>
      <ExplanationHero />
      <NaviCardList />
      <CourseAndModuleList />
      <EmailSubscribe />
    </div>
  )
}

export default Home
