import * as React from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import SkipLink from "../components/SkipLink"

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <SkipLink />
    <Header />
    <main id="main">{children}</main>
  </div>
)

export default Layout
// <Footer />
