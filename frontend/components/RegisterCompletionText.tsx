import React, { Component } from 'react';
import { Typography, Card, CardContent, CardHeader } from "@material-ui/core";
import NextI18Next from '../i18n';




type RegProps = {
    email: String;
    t: Function;
    link: String,
  }

class RegisterCompletionText extends Component<RegProps> {
    componentDidMount(){
        console.log(this.props)
        
    }
    
    render() {
      const {email, t ,link} = this.props
      return(
        
        <Card role='region' aria-labelledby="instructions-title" >
            <CardHeader>
            <Typography variant="h3" gutterBottom={true} id="instructions-title" align='center'>
                <NextI18Next.Trans i18nKey='instructions-title' />
              </Typography>
              <Typography variant="subheading" gutterBottom={true}  align='center'>
                <NextI18Next.Trans i18nKey='NB' />
              </Typography>
            </CardHeader>
            <CardContent>
                
                <Typography variant="body1" paragraph color='error'>
                  <NextI18Next.Trans i18nKey='Instructions1' /> {email}
                </Typography>
                <Typography variant="body1" paragraph>
                  <NextI18Next.Trans i18nKey='Instructions2' /> {link}
                </Typography>
                <Typography variant="body1" paragraph>
                  <NextI18Next.Trans i18nKey='Instructions3'/> {email}
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