import React, { useState } from "react"
import { ButtonBase, Typography } from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import grey from "@material-ui/core/colors/grey"
import MoocIcon from "@material-ui/icons/Book"
import DefaIcon from "@material-ui/icons/LocationCity"
import TeacherIcon from "@material-ui/icons/People"
import { Motion, spring } from "react-motion"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      marginBottom: "2rem",
      display: "block",
      textAlign: "left",
      padding: "1rem",
      overflow: "hidden",
      transition: "background-color 250ms cubic-bezier(0.4,0,0.2,1)",
      borderRradius: 4,
    },
    header: {
      display: "flex",
    },
    heading: {
      fontSize: "1.3rem",
      color: `${grey[800]}`,
      fontWeight: 400,
      flex: 1,
    },
    expandMoreIcon: {
      alignSelf: "right",
      transition: "all 0.3s",
    },
    shortDescription: {
      padding: "0 1.85rem",
      fontSize: 16,
      fontWeight: 400,
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      lineHeight: "1.46429em",
    },
    longDescription: {
      height: "calc(var(--open-ratio) * var(--calculated-height) * 1px)",
      overflow: "hidden",
      padding: "0 1.85rem",
      marginTop: "0.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: 16,
      fontWeight: 400,
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      lineHeight: "1.46429em",
    },
    itemIcon: {
      marginRight: "0.3rem",
      color: `${grey[700]}`,
    },
  }),
)
function ExpansionPanelItem() {
  const classes = useStyles()
  const longDescriptionRef = React.createRef()
  const [isExpanded, setIsExpanded] = useState(false)
  const [disableRipple, setDisableRipple] = useState(false)

  return (
    <ButtonBase className={classes.card}>
      <div className={classes.header}>
        <MoocIcon className={classes.itemIcon} />
        <Typography className={classes.heading}>
          Kaikille avoimia kursseja
        </Typography>
        <ExpandMoreIcon />
      </div>
      <div className={classes.shortDescription}>
        Verkko-oppimista parhaimmillaan. Älä huolehdi kurssimaksuista tai
        koulumatkoista, vaan opiskele missä sinulle sopii.
      </div>
      <Motion style={{ openRatio: spring(isExpanded ? 1 : 0) }}>
        {({ openRatio }) => {
          return (
            <p
              className={classes.longDescription}
              style={{ "--open-ratio": `${openRatio}` }}
            >
              MOOCit eli kaikille avoimet verkkokursit(Massive Open Online
              Course) ovat nimensä mukaisesti kaikki kurssit ovat avoimia,
              ilmaisia ja verkkopohjaisia.
            </p>
          )
        }}
      </Motion>
    </ButtonBase>
  )
}

export default ExpansionPanelItem
