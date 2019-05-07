import React, { Component } from 'react';
import { Typography, 
        Card, 
        CardContent, 
        CardHeader , 
        Avatar
        } from "@material-ui/core";
import WarningIcon from '@material-ui/icons/Error';
import NextI18Next from '../i18n';
import styled from "styled-components";

const ImportantNotice = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin: auto;
  height: 3em;
  & > * {
    margin-right: 1rem;
  }
  margin-bottom: 1rem;
`;


type RegProps = {
    email: String;
    t: Function;
    link: string,
  }

class RegisterCompletionText extends Component<RegProps> {
    render() {
      const {email, t ,link} = this.props
      return(
        
        <Card role='region' aria-labelledby="instructions-title">
            <CardContent>
            <Typography variant="h3" gutterBottom={true} id="instructions-title" align='center'>
                <NextI18Next.Trans i18nKey='instructions-title' />
              </Typography>
              <ImportantNotice>
              <Avatar >
                <WarningIcon />
              </Avatar>
                <Typography variant="body1"  inline>
                  <NextI18Next.Trans i18nKey='Instructions1' /> {email}
                </Typography>
              </ImportantNotice>
                <Typography variant="body1" paragraph>
                  <NextI18Next.Trans i18nKey='Instructions2' /> 
                  <a href={link}>rekisteröitymislomakkeeseen</a>
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