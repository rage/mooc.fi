import React, { Component } from 'react';
import { Typography, Card, CardContent } from "@material-ui/core";
import NextI18Next from '../i18n'
import { EvalSourceMapDevToolPlugin } from 'webpack';


type RegProps = {
    email: String;
    t: Function;
  }

class RegisterCompletionText extends Component<RegProps> {
    componentDidMount(){
        console.log(this.props)
    }
    render() {
     const {email, t} = this.props
      return(
        <div>
        <div>
              <Typography variant="h3" component="h1" gutterBottom={true}>
                {t('h1')}
              </Typography>
            <Typography variant="h6" gutterBottom={true}>
               {t('course-title')}
            </Typography>
            <Typography variant="body1" paragraph>
                {t('course-points')}
            </Typography>
            <Typography variant="body1" paragraph>
                {t('course-register')}
            </Typography>
            <Typography variant="body1" paragraph color='error'>
                {t('course-note')}
            </Typography>
        </div>
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom={true}>
                    Toimi näin:
                </Typography>
                
                <Typography variant="body1" paragraph>
                1. Täytä lomake <a href="https://www.avoin.helsinki.fi/palvelut/esittely.aspx?o=127290002">täällä</a>
                </Typography>
                <Typography variant="body1" paragraph>
                2. Täytä lomakkeen kohtaan: "Käyttämäsi sähköpostiosoite MOOC-kurssilla" sähköpostiosoitteeksi "{email}" ilman lainausmerkkejä.
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

export default NextI18Next.withNamespaces('register-completion')(RegisterCompletionText)