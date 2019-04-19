import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import JssProvider from "react-jss/lib/JssProvider";
import { ApolloProvider } from "react-apollo";
import getPageContext from "../lib/getPageContext";
import withApollo from "../lib/with-apollo";
import Layout from "./_layout";
import { isSignedIn } from "../lib/authentication";
import LoginStateContext from "../contexes/LoginStateContext";

class MyApp extends App {
  constructor() {
    super();
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <Container>
        <Head>
          <title>Näyttökoe</title>
        </Head>
        {/* Wrap every page in Jss and Theme providers */}
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server-side. */}
            <ApolloProvider client={apollo}>
              <LoginStateContext.Provider value={this.props.signedIn}>
                <Layout>
                  <Component pageContext={this.pageContext} {...pageProps} />
                </Layout>
              </LoginStateContext.Provider>
            </ApolloProvider>
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

// We're probably not supposed to do this
const originalGetIntialProps = MyApp.getInitialProps;

MyApp.getInitialProps = async arg => {
  const { ctx } = arg;
  let originalProps = {};
  if (originalGetIntialProps) {
    originalProps = (await originalGetIntialProps(arg)) || {};
  }

  return {
    ...originalProps,
    signedIn: isSignedIn(ctx)
  };
};

export default withApollo(MyApp);
