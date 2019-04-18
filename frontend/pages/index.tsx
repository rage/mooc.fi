import * as React from "react";
import { ApolloClient } from "apollo-boost";
import SlotList from "../components/SlotList";
import { NextContext } from "next";
import { isSignedIn } from "../lib/authentication";
import redirect from "../lib/redirect";

function Home() {
  return (
    <div>
      Welcome to Next.js!
      <SlotList />
    </div>
  );
}

Home.getInitialProps = function(context: NextContext) {
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in");
  }
  return {};
};

export default Home;
