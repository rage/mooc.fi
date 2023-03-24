import CourseAndModuleList from "/components/Home/CourseAndModuleList"
import ExplanationHero from "/components/Home/ExplanationHero"
import NaviCardList from "/components/Home/NaviCardList"

const Home = () => {
  return (
    <div>
      <ExplanationHero />
      <NaviCardList />
      <CourseAndModuleList />
    </div>
  )
}

export default Home
