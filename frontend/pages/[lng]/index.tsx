import React from "react"
import ExplanationHero from "/components/Home/ExplanationHero"
import NaviCardList from "/components/Home/NaviCardList"
import EmailSubscribe from "/components/Home/EmailSubscribe"
import CourseAndModuleList from "/components/Home/CourseAndModuleList"
/* const allCoursesBanner = require("../static/images/AllCoursesBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000")
const oldCoursesBanner = require("../static/images/oldCoursesBanner.jpg?resize&sizes[]=400&sizes[]=600&sizes[]=1000&sizes[]=2000") */

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
