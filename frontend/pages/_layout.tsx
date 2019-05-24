import * as React from "react"
import Container from "../components/Container"
import Header from "../components/Header"
import Footer from "../components/Footer"
import SkipLink from "../components/SkipLink"
import CssBaseline from "@material-ui/core/CssBaseline"

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <CssBaseline />
    <SkipLink />
    <Header />
    <main id="main">{children}</main>
  </div>
)

export default Layout
// <Footer />
