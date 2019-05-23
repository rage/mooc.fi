import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, Avatar } from "@material-ui/core";
import NextI18Next from '../i18n';

function UniversityLogo(props:any) {
    return (
        <img 
            alt='Logo of the University of Helsinki'
            src='../static/images/uh-logo.png'
        />
    )
}

function SocialMediaIcons(props:any) {

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appbar: {
            top: 'auto',
            bottom: 0,
            backgroundColor: '#202124'
        }

    })
)
function Footer() {
    const classes = useStyles()
    return (
        <AppBar className={classes.appbar}>
            <Toolbar>
                <UniversityLogo />
                <Typography variant='body1'>
                    The site is maintained by the RAGE research group.
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default NextI18Next.withNamespaces('common')(Footer)