import * as React from "react";
import TopBar from "../components/TopBar";
import Container from "../components/Container";



const Layout = ({ children }: { children: React.ReactNode }) => (
    <div>
      <a href="#main"> Skip to main content </a>
      <TopBar />
      <Container>{children}</Container>
    </div>
);

export default Layout;
