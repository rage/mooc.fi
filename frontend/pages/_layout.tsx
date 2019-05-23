import * as React from "react";
import Container from "../components/Container";
import Header from '../components/Header'
import Footer from '../components/Footer'
import SkipLink from '../components/SkipLink'
//<a href="#main"> Skip to main content </a>
const Layout = ({ children }: { children: React.ReactNode }) => (
    <div>
      <SkipLink />
      <Header />
      <Container>{children}</Container>
     
    </div>
);

export default Layout;
// <Footer />