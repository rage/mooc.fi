import * as React from "react";
import { ApolloClient, gql } from "apollo-boost";
import SlotList from "../components/SlotList";
import { NextContext } from "next";
import { isSignedIn } from "../lib/authentication";
import redirect from "../lib/redirect";
import { Typography } from "@material-ui/core";
import AnswerEssays from "../components/AnswerEssays";
import { useQuery } from "react-apollo-hooks";
import { UserOverView as UserOverViewData } from "./__generated__/UserOverView";
import Steps from "../components/Steps";
import UserOverView from "../components/UserOverView";

export const UserOverViewQuery = gql`
  query UserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      email
      administrator
      completed_enough
      slot {
        id
      }
      essays {
        id
      }
    }
  }
`;

function Home() {
  const { loading, error, data } = useQuery<UserOverViewData>(
    UserOverViewQuery
  );
  if (error) {
    return (
      <div>
        Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
      </div>
    );
  }
  if (loading || !data) {
    return <div>Loading</div>;
  }

  const canRegister =
    data.currentUser.completed_enough || data.currentUser.administrator;

  return (
    <div>
      <Typography variant="h3" component="h1">
        Näyttökokeeseen ilmoittautuminen
      </Typography>
      {canRegister ? (
        <div>
          <p>
            Voit ilmoittautua tässä ohjelmoinnin MOOCin näyttökokeeseen. Seuraa
            alla olevia ohjeita.{" "}
            {data.currentUser.administrator &&
              "Näet tämän sivun koska olet admin."}
          </p>
          <Steps />
          <UserOverView />
          <SlotList />
          <AnswerEssays />
        </div>
      ) : (
        <div>
          <p>
            Käyttäjätunnuksellasi ei ole lupaa rekisteröityä näyttökokeeseen.
            Varmista että olet kirjautunut oikealla tunnuksella sisään ja että
            olet saanut Ohjelmoinnin MOOC 2019 jokaisen osan
            ohjelmointitehtävien pisteistä vähintään 90%.
          </p>

          <p>Epäselvyyksissä ota yhteyttä osoitteeseen mooc@cs.helsinki.fi</p>
        </div>
      )}
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
