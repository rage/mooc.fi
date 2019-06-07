import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Toolbar, Typography, Button, Avatar } from "@material-ui/core"
import NextI18Next from "../i18n"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTwitter,
  faFacebook,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons"

function UniversityLogo(props: any) {
  const classes = useStyles()
  return (
    <img
      alt="Logo of the University of Helsinki"
      src="../static/images/uh-logo.png"
      className={classes.logoImage}
    />
  )
}

function SocialMediaIcons(props: any) {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appbar: {
      top: "auto",
      bottom: 0,
      backgroundColor: "#202124",
      color: "white",
    },
    logoImage: {
      height: 75,
    },
  }),
)
function Footer() {
  const classes = useStyles()
  return (
    <div className={classes.appbar}>
      <Toolbar>
        <Typography variant="body1">mooc@cs.helsinki.fi</Typography>
        <UniversityLogo />
        <Typography variant="body1">
          The site is maintained by the RAGE research group.
        </Typography>
      </Toolbar>
    </div>
  )
}

export default NextI18Next.withNamespaces("common")(Footer)
