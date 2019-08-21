import React from "react"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import ModuleNaviCard from "./ModuleNaviCard"
import NextI18Next from "../../i18n"
import Container from "../Container"
import { ObjectifiedModule } from "../../static/types/moduleTypes"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      [theme.breakpoints.up("xs")]: {
        fontSize: 46,
      },
      [theme.breakpoints.up("md")]: {
        fontSize: 72,
      },
      marginTop: "2rem",
      marginBottom: "1em",
    },
  }),
)

function ModuleNavi({
  modules,
  loading,
}: {
  modules: ObjectifiedModule[]
  loading: boolean
}) {
  const { t } = NextI18Next.useTranslation("home")
  const classes = useStyles()

  return (
    <section style={{ marginBottom: "5em" }}>
      <Typography component="h2" className={classes.title} align="center">
        {t("modulesTitle")}
      </Typography>
      <Container>
        <Grid container spacing={5}>
          {loading ? (
            <>
              <ModuleNaviCard key="skeletonnavicard1" />
              <ModuleNaviCard key="skeletonnavicard2" />
            </>
          ) : (
            (modules || []).map(module => (
              <ModuleNaviCard key={`module-${module.name}`} module={module} />
            ))
          )}
        </Grid>
      </Container>
    </section>
  )
}

export default ModuleNavi
