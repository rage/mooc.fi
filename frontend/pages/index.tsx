import * as React from "react"
import { Typography } from "@material-ui/core"
import withI18n from "../lib/withI18n"
import ExplanationHero from "../components/Home/ExplanationHero"
import { WideContainer } from "../components/Container"
import CourseHighlights from "../components/Home/CourseHighlights"
import Modules from "../components/Home/Modules"

function Home() {
  return (
    <div>
      <ExplanationHero />
      <CourseHighlights />
      <Modules />
    </div>
  )
}

export default Home
