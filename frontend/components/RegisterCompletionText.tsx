import React, { Component } from 'react';
import { Typography, Card, CardContent } from "@material-ui/core";





type RegProps = {
    email: String;
  }

class RegisterCompletionText extends Component<RegProps> {
    componentDidMount(){
        console.log(this.props)
    }
    render() {
     
      return(
        <div role='main'>
        <div>
              <Typography variant="h2"  gutterBottom={true}>
                Rekisteröi Kurssisuoritus
              </Typography>
            <Typography variant="body1" gutterBottom={true}>
               Kurssin otsikko
            </Typography>
            <Typography variant="body1" paragraph>
                Points
            </Typography>
            <Typography variant="body1" paragraph>
                Rekisteröidy
            </Typography>
            <Typography variant="body1" paragraph color='error'>
                Huom
            </Typography>
        </div>
        <Card>
            <CardContent>
                <Typography variant="h3" gutterBottom={true}>
                    Toimi näin:
                </Typography>
                
                <Typography variant="body1" paragraph>
                1. Täytä lomake <a href="https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=127290002">täällä</a>
                </Typography>
                <Typography variant="body1" paragraph>
                2. Täytä lomakkeen kohtaan: "Käyttämäsi sähköpostiosoite MOOC-kurssilla" sähköpostiosoitteeksi "" ilman lainausmerkkejä.
                </Typography>
                <Typography variant="body1" paragraph>
                3. Jos haluat tiedon sähköpostiisi opintopisteidesi kirjautumisesta, muista rastittaa "Henkilötietojen käyttö" -laatikon alta kohta "Opintosuorituksista lähetetään ilmoitus sähköpostiini (sisältää arvosanan)"". 
                </Typography>
                <Typography variant="body1" paragraph>
                4. Opintosuoritus kirjataan kuuden viikon sisään lomakkeen täyttämisestä.
                </Typography>
            </CardContent>
        </Card>
        <div>
          <Typography variant='body1' paragraph>
            HUOM! Jos olet Helsingin yliopiston perustutkinto-opiskelija, nämä ilmoittautumisohjeet koskevat myös sinua. Vain niiden opiskelijoiden
            suoritukset rekisteröidään, jotka ilmoittautuvat kurssille Avoimen yliopiston kautta. 
          </Typography>
        </div>
        
      </div>
      )
    }
  }

export default RegisterCompletionText