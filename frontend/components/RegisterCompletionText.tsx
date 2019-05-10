import React, { Component } from 'react';
import { Typography, 
         Paper,
        
        } from "@material-ui/core";
import WarningIcon from '@material-ui/icons/Error';
import NextI18Next from '../i18n';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
     padding: '1em',
     margin: '1em'
    },
    
  }),
);




type RegProps = {
    email: String;
    t: Function;
    link: string,
  }
function RegisterCompletionText(props: RegProps)
{
  const classes = useStyles()
  return(
    <Paper className={classes.paper}>
      <Typography variant='h4' component='h2' gutterBottom={true}>
        <NextI18Next.Trans i18nKey='instructions-title' />
      </Typography>
      <Typography variant="body1" paragraph>
        <NextI18Next.Trans i18nKey='Instructions2' /> 
        <a href={props.link}>rekisteröitymislomakkeeseen</a>
      </Typography>
      <Typography variant="body1" paragraph>
        <NextI18Next.Trans i18nKey='Instructions3'/> {props.email}
      </Typography>
      <Typography variant="body1" paragraph>
        <NextI18Next.Trans i18nKey='Instructions4' />
      </Typography>
      <Typography variant="body1" paragraph>
        <NextI18Next.Trans i18nKey='grades' />
      </Typography>
    </Paper>
        
  )
}

export default NextI18Next.withNamespaces('register-completion')(RegisterCompletionText)

/*<Card role='region' aria-labelledby="instructions-title">
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
       */