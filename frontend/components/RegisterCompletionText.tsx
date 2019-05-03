import React, { Component } from 'react';
import { Typography, Card, CardContent } from "@material-ui/core";
import NextI18Next from '../i18n';




type RegProps = {
    email: String;
    t: Function;
  }

class RegisterCompletionText extends Component<RegProps> {
    componentDidMount(){
        console.log(this.props)
        
    }
    
    render() {
      const {email, t } = this.props
      return(
        
        <Card role='region' aria-labelledby="instructions-title">
            <CardContent>
                <Typography variant="h3" gutterBottom={true} id="instructions-title">
                    <NextI18Next.Trans i18nKey='instructions-title' />
                </Typography>
                
                <Typography variant="body1" paragraph>
                  <NextI18Next.Trans i18nKey='Instructions1' />
                </Typography>
                <Typography variant="body1" paragraph>
                  <NextI18Next.Trans i18nKey='Instructions2' />
                </Typography>
                <Typography variant="body1" paragraph>
                  <NextI18Next.Trans i18nKey='Instructions3'/>
                </Typography>
                <Typography variant="body1" paragraph>
                  <NextI18Next.Trans i18nKey='Instructions4' />
                </Typography>
            </CardContent>
        </Card>
        
      )
    }
  }

export default NextI18Next.withNamespaces('register-completion')(RegisterCompletionText)