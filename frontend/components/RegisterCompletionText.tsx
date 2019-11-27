import React, { useContext } from "react"
import { Typography, Paper, Button, Tooltip } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import LanguageContext from "/contexes/LanguageContext"
import getRegisterCompletionTranslator from "/translations/register-completion"

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
  const lng = useContext(LanguageContext)
  const t = getRegisterCompletionTranslator(lng.language)
  return (
    <Tooltip
      title={t("linkAria")}
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
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("link")}
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
  const lng = useContext(LanguageContext)
  const t = getRegisterCompletionTranslator(lng.language)
  return (
    <Paper className={classes.paper}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom={true}
        align="center"
      >
        {t("instructions-title")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("Instructions2")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("Instructions3")} {props.email}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("Instructions4")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("grades")}
      </Typography>
      <LinkButton className={classes.button} link={props.link} />
    </Paper>
  )
}

export default RegisterCompletionText
