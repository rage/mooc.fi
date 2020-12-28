import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      left: -999,
      position: "absolute",
      top: "auto",
      height: 1,
      width: 1,
      overflow: "hidden",
      zIndex: -999,
      "&:focus": {
        color: "white",
        backgroundColor: "black",
        left: "auto",
        top: "auto",
        width: "30%",
        height: "auto",
        overflow: "auto",
        margin: 10,
        padding: 5,
        borderRadius: 15,
        textAlign: "center",
        fontSize: "1.2em",
        zIndex: 999,
      },
      "&:active": {
        color: "white",
        backgroundColor: "black",
        left: "auto",
        top: "auto",
        width: "30%",
        height: "auto",
        overflow: "auto",
        margin: 10,
        padding: 5,
        borderRadius: 15,
        textAlign: "center",
        fontSize: "1.2em",
        zIndex: 999,
      },
    },
  }),
)

function SkipLink() {
  const classes = useStyles()
  const t = useTranslator(CommonTranslations)

  return (
    <a href="#main" className={classes.link}>
      <Typography variant="body1">{t("skiplink")}</Typography>
    </a>
  )
}

export default SkipLink
