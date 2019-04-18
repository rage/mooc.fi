import * as React from "react";
import { ApolloClient } from "apollo-boost";
import SlotList from "../components/SlotList";
import { NextContext } from "next";
import { isSignedIn } from "../lib/authentication";
import redirect from "../lib/redirect";
import UserOverView from "../components/UserOverView";
import Steps from "../components/Steps";
import { Typography } from "@material-ui/core";

function Home() {
  return (
    <div>
      <Typography variant="h3" component="h1">
        Näyttökokeeseen ilmoittautuminen
      </Typography>
      <p>Voit ilmoittautua tässä ohjelmoinnin MOOCin näyttökokeeseen. Seuraa alla olevia ohjeita.</p>
      <Steps />
      <UserOverView />
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
