import * as React from "react";
import TopBar from "../components/TopBar";
import Container from "../components/Container";
import { addLocaleData } from "react-intl";
import locale_en from 'react-intl/locale-data/en';
import locale_fi from 'react-intl/locale-data/fi';

addLocaleData([...locale_en, ...locale_fi]);


const Layout = ({ children }: { children: React.ReactNode }) => (
    <div>
      <TopBar />
      <Container>{children}</Container>
    </div>
);

export default Layout;
