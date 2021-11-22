import RegisterCompletionTranslations from "/translations/register-completion"
import { useTranslator } from "/util/useTranslator"

import { Button, Paper, Tooltip, Typography } from "@material-ui/core"
import { Theme } from "@material-ui/core/styles"
import { createStyles, makeStyles } from "@material-ui/styles"

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
    registrationButtons: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  }),
)

interface LinkButtonProps {
  link: string
  onRegistrationClick: Function
}

function LinkButton({ link, onRegistrationClick }: LinkButtonProps) {
  const classes = useStyles()
  const t = useTranslator(RegisterCompletionTranslations)

  const onClick = () => {
    try {
      window.open(link, "_blank", "noopener noreferrer")
      onRegistrationClick()
    } catch {
      console.error("error opening registration link")
    }
  }

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
        className={classes.button}
        role="link"
        onClick={onClick}
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
  onRegistrationClick: Function
}
function RegisterCompletionText({
  email,
  link,
  tiers,
  onRegistrationClick,
}: RegProps) {
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
        {t("Instructions3")} {email}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("Instructions4")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("grades")}
      </Typography>
      {tiers.length > 0 ? (
        tiers.map((tier: any, i: number) => (
          <div key={i} className={classes.registrationButtons}>
            <Typography variant="body1" paragraph align="center">
              {tier.name}
            </Typography>
            <LinkButton
              link={tier.link}
              onRegistrationClick={onRegistrationClick}
            />
          </div>
        ))
      ) : (
        <LinkButton link={link} onRegistrationClick={onRegistrationClick} />
      )}
    </Paper>
  )
}

export default RegisterCompletionText
