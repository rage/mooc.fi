<<<<<<< HEAD
import * as React from "react";
import Container from "../components/Container";
import Header from '../components/Header'
import Footer from '../components/Footer'
import SkipLink from '../components/SkipLink'

const Layout = ({ children }: { children: React.ReactNode }) => (
    <div>
      <SkipLink />
      <Header />
      <main id="main">
        {children}
      </main>

    </div>
);
=======
import * as React from "react"
import Container from "../components/Container"
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
>>>>>>> 20b0bc473b69f302447158c775bd0d7e61ff893e

export default Layout
// <Footer />
