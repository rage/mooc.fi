import * as React from "react";
import { AppBar, Toolbar, Typography, Button, Avatar } from "@material-ui/core";
import { signOut } from "../lib/authentication";
import LoginStateContext from "../contexes/LoginStateContext";
import { useApolloClient } from "react-apollo-hooks";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import NextI18Next from '../i18n';



function TitleText(props:any) {
  return (
    <Typography variant='body1' {...props} >
      MOOC Points
    </Typography>
  )
}

function LogoImage(props:any) {
  return (
    <Avatar
      alt='MOOC logo'
      src='../static/images/logo.png'
      {...props}>
    </Avatar>
  )
}

function LogOutButton(props:any) {
  return(
    <Button
      color='inherit'
      onClick={props.onclick}> 
      <NextI18Next.Trans i18nKey='logout' />
    </Button>
  )
}


const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    title: {
      fontFamily: "Open Sans Condensed, sans-serif",
      fontSize: "1.75rem",
      flex: 1,
    },
    avatar: {
      margin: "1em",
    }
  })
)

function Header() {
  const classes = useStyles();
  const loggedIn = React.useContext(LoginStateContext);
  const client = useApolloClient();
  
  return(
    <AppBar position="static" color='inherit'>
      <Toolbar>
        <LogoImage className={classes.avatar} />
        <TitleText className={classes.title} />
        { loggedIn && <LogOutButton 
          onclick={() => signOut(client)}/>
        }
      </Toolbar>
    </AppBar>
  )
}

export default NextI18Next.withNamespaces('common')(Header)


