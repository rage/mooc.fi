import React from "react"
import { Tabs, Tab, SvgIcon } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabs: {
      padding: "0.7em",
      backgroundColor: "white",
    },
  }),
)

function FlagIcon({ path }) {
  return (
    <SvgIcon>
      <path d={path} />
    </SvgIcon>
  )
}

function LanguageSelectorBar({ value, handleChange }) {
  const classes = useStyles()
  console.log("At langbar", value)
  console.log(handleChange)

  return (
    <section>
      <Tabs
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        className={classes.tabs}
        centered
      >
        {" "}
        <Tab label="SELECT COURSE LANGUAGE" disabled />
        <Tab label="FI" />
        <Tab label="EN" />
        <Tab label="SE" />
        <Tab label="ALL" />
      </Tabs>
    </section>
  )
}

export default LanguageSelectorBar
