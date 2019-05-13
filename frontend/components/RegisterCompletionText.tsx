import React, { Component } from 'react';
import { Typography, 
         Paper,
         Button
        
        } from "@material-ui/core";
import NextI18Next from '../i18n';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
     padding: '1em',
     margin: '1em',
     display: 'flex',
     flexDirection: 'column',
    },
    button: {
      width: '65%'
    }
  }),
);

function LinkButton(props:any) {
  return(
    <Button 
      variant='contained' 
      color='secondary' 
      size='medium'
      href={props.link} 
      {...props}>
      Rekisteröitymislomakkeeseen
    </Button>
  )
}


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
      <Typography variant='h4' component='h2' gutterBottom={true} align='center'>
        <NextI18Next.Trans i18nKey='instructions-title' />
      </Typography>
      <Typography variant="body1" paragraph>
        <NextI18Next.Trans i18nKey='Instructions2' /> 
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
      <LinkButton 
        className={classes.button}
        link={props.link}/>
    </Paper>
        
  )
}

export default NextI18Next.withNamespaces('register-completion')(RegisterCompletionText)

