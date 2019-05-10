import * as React from "react";
import Container from "../components/Container";
import Header from '../components/Header'
import Footer from '../components/Footer'

const Layout = ({ children }: { children: React.ReactNode }) => (
    <div>
      <a href="#main"> Skip to main content </a>
      <Header />
      <Container>{children}</Container>
     
    </div>
);

export default Layout;
// <Footer />