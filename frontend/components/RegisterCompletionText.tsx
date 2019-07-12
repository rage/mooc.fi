import React from "react"
import { Typography, Paper, Button, Tooltip } from "@material-ui/core"
import NextI18Next from "../i18n"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: "1em",
      margin: "1em",
      display: "flex",
      flexDirection: "column",
    },
    button: {
      width: "65%",
      margin: "auto",
      marginBottom: "1em",
    },
    tooltip: {
      backgroundColor: theme.palette.common.white,
      fontSize: 11,
      color: "black",
      border: "1px solid black",
    },
  }),
)

function LinkButton(props: any) {
  const classes = useStyles()
  return (
    <Tooltip
      title={<NextI18Next.Trans i18nKey="register-completion:linkAria" />}
      classes={{ tooltip: classes.tooltip }}
      placement="bottom"
    >
      <Button
        variant="contained"
        color="secondary"
        size="medium"
        href={props.link}
        {...props}
        role="link"
      >
        <NextI18Next.Trans i18nKey="register-completion:link" />
      </Button>
    </Tooltip>
  )
}

type RegProps = {
  email: String
  link: string
}
function RegisterCompletionText(props: RegProps) {
  const classes = useStyles()
  return (
    <Paper className={classes.paper}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom={true}
        align="center"
      >
        <NextI18Next.Trans i18nKey="register-completion:instructions-title" />
      </Typography>
      <Typography variant="body1" paragraph>
        <NextI18Next.Trans i18nKey="register-completion:Instructions2" />
      </Typography>
      <Typography variant="body1" paragraph>
        <NextI18Next.Trans i18nKey="register-completion:Instructions3" />{" "}
        {props.email}
      </Typography>
      <Typography variant="body1" paragraph>
        <NextI18Next.Trans i18nKey="register-completion:Instructions4" />
      </Typography>
      <Typography variant="body1" paragraph>
        <NextI18Next.Trans i18nKey="register-completion:grades" />
      </Typography>
      <LinkButton className={classes.button} link={props.link} />
    </Paper>
  )
}

export default RegisterCompletionText
