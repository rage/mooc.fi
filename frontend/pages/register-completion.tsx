import * as React from "react";
import { ApolloClient, gql } from "apollo-boost";
import { Typography, Card, CardContent } from "@material-ui/core";
import { NextContext } from "next";
import { isSignedIn } from "../lib/authentication"
import redirect from "../lib/redirect";
import { useQuery } from "react-apollo-hooks";
import { UserOverView as UserOverViewData } from "./__generated__/UserOverView";


export const UserOverViewQuery = gql`
  query UserOverView {
    currentUser {
      id
      upstream_id
      first_name
      last_name
      email
    }
  }
`;


function RegisterCompletion() {
    const { loading, error, data } = useQuery<UserOverViewData>(
        UserOverViewQuery
      );
    if(error){
        console.log('no work')
    }
    if (loading || !data) {
        return <div>Loading</div>;
    }
    console.log('userData',data)
    return (
      <div>
        <div>
            <Typography variant="h3" component="h1">
                Opintopisteiden Rekisteröinti
            </Typography>
            <Typography variant="h6">
                Olet suorittanut kurssin The Elements of AI.
            </Typography>
            <Typography variant="body1" paragraph>
                Jos sinulla on suomalainen henkilötunnus, saat kurssista kahden opintopisteen laajuisen suoritusmerkinnän Helsingin yliopiston opintorekisteriin. 
                Helsingin yliopiston avoin yliopisto hoitaa suoritusten rekisteröinnin. 
                Opintosuorituksen rekisteröinti on ilmaista.
            </Typography>
            <Typography variant="body1" paragraph>
                Nyt sinun tulee ilmoittautua Helsingin yliopiston avoimeen yliopistoon, jotta voimme rekisteröidä suorituksesi.
            </Typography>
        </div>
        <Card>
            <CardContent>
                <Typography variant="h5">
                    Toimi näin:
                </Typography>
                <Typography variant="body1" paragraph>
                1. Huomaa, että sinun täytyy käyttää kohdan 2 reksteröintilomakkeessa sähköpostiosoitetta "{data.currentUser.email}" (ilman lainausmerkkejä). Jos et käytä tätä osoitetta lomakkeessa, suoritustasi ei voida kirjata.
                </Typography>
                <Typography variant="body1" paragraph>
                2. Täytä lomake <a href="https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=127290002">täällä</a>
                </Typography>
                <Typography variant="body1" paragraph>
                3. Täytä lomakkeen kohtaan: "Käyttämäsi sähköpostiosoite MOOC-kurssilla" sähköpostiosoitteeksi "{data.currentUser.email}" ilman lainausmerkkejä.
                </Typography>
                <Typography variant="body1" paragraph>
                4. Jos haluat tiedon sähköpostiisi opintopisteidesi kirjautumisesta, muista rastittaa "Henkilötietojen käyttö" -laatikon alta kohta "Opintosuorituksista lähetetään ilmoitus sähköpostiini (sisältää arvosanan)"". 
                </Typography>
                <Typography variant="body1" paragraph>
                5. Opintosuoritus kirjataan kuuden viikon sisään lomakkeen täyttämisestä.
                </Typography>
            </CardContent>
        </Card>
        
      </div>
    );
  }

  RegisterCompletion.getInitialProps = function(context: NextContext) {
    if (!isSignedIn(context)) {
      redirect(context, "/sign-in");
    }
    return {};
  };

  export default RegisterCompletion;