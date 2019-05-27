import React from "react"
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@material-ui/core"
import DashboardIcon from "@material-ui/icons/Dashboard"
import Link from "next/link"

function CardContentGrid({ completer }) {
  return (
    <Grid container spacing={1} direction="row" alignItems="flex-start">
      <Grid item>
        <Typography variant="body1">{completer.user.first_name}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">{completer.user.last_name}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">{completer.user.student_number}</Typography>
      </Grid>
    </Grid>
  )
}

function CompletionCard({ completer }) {
  return (
    <Grid item xs={12} sm={12} lg={8}>
      <Card>
        <CardContent>
          <CardContentGrid completer={completer} />
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CompletionCard

export function HeaderCard({ course, language }) {
  return (
    <Grid item xs={12} sm={12} lg={8}>
      <Card>
        <CardContent>
          <Typography component="h2" variant="h4">
            Elements of Ai
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
