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
     margin: '1em',
     backgroundColor: '#9c27b0',
     color: 'white'
    },
    
  }),
);

type RegProps = {
    email: String;
    t: Function;
  }
function ImportantNotice(props: RegProps)
{
  const classes = useStyles()
  return(
    <Paper className={classes.paper} >
      <Typography>
        <NextI18Next.Trans i18nKey='Instructions1' />  
      </Typography> 
    </Paper>
        
  )
}

export default NextI18Next.withNamespaces('register-completion')(ImportantNotice)

