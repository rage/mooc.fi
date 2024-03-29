import { styled } from "@mui/material/styles"

import Catalogue from "/components/NewLayout/Courses/Catalogue"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withNoSsr from "/util/withNoSsr"

/*
  secret project gray palette
  F5F6F7
  EBEDEE
  E2E4E6
  D8D8DD
  CED2D5
  C4C9CD
  BEC3C7
*/

const Background = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`

function Courses() {
  useBreadcrumbs([
    {
      translation: "courses",
      href: "/courses",
    },
  ])

  return (
    <>
      <Background />
      <Catalogue />
    </>
  )
}

export default withNoSsr(Courses)
