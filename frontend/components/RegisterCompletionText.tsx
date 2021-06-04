import { Typography, Paper, Button, Tooltip } from "@material-ui/core"
import { Theme } from "@material-ui/core/styles"
import { createStyles, makeStyles } from "@material-ui/styles"
import { useTranslator } from "/util/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"

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
  const t = useTranslator(RegisterCompletionTranslations)
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
  tiers: any
}
function RegisterCompletionText(props: RegProps) {
  const classes = useStyles()
  const t = useTranslator(RegisterCompletionTranslations)
  return (
    <Paper className={classes.paper}>
      <Typography variant="body1" paragraph>
        {t("credits_details")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("donow")}
      </Typography>
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
      {props.tiers ? (
        props.tiers.map((tier: any) => (
          <>
            <Typography variant="body1" paragraph align="center">
              {tier.name}
            </Typography>
            <LinkButton className={classes.button} link={tier.link} />
          </>
        ))
      ) : (
        <LinkButton className={classes.button} link={props.link} />
      )}
    </Paper>
  )
}

export default RegisterCompletionText
