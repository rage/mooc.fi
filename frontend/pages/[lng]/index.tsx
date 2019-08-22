import React from "react"
import ExplanationHero from "/components/Home/ExplanationHero"
import NaviCardList from "/components/Home/NaviCardList"
import EmailSubscribe from "/components/Home/EmailSubscribe"
import CourseAndModuleList from "/components/Home/CourseAndModuleList"

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
