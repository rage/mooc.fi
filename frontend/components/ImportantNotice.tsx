import { Typography, Paper, SvgIcon } from "@material-ui/core"
import RegisterCompletionTranslations from "/translations/register-completion"

import { createStyles, makeStyles } from "@material-ui/core/styles"
import { useTranslator } from "/translations"

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      padding: "1em",
      margin: "1em",
      backgroundColor: "#9c27b0",
      color: "white",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      height: 50,
      width: 50,
      margin: "0.5em",
      color: "white",
    },
  }),
)

function AlertIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
    </SvgIcon>
  )
}

type RegProps = {
  email: String
}
function ImportantNotice(props: RegProps) {
  const classes = useStyles()
  const t = useTranslator(RegisterCompletionTranslations)

  return (
    <Paper className={classes.paper}>
      <AlertIcon className={classes.icon} />
      <Typography>
        {t("Instructions1")} {props.email}
      </Typography>
    </Paper>
  )
}

export default ImportantNotice
