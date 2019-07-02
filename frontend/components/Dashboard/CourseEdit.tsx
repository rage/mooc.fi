import React, { useState, useEffect } from "react"
import { Paper } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { default as firebase } from "../../lib/firebase"
import uuid from "../../../util/uuid"
import CourseEditForm from "./CourseEditForm"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      marginTop: "0.7em",
      marginBottom: "0.7em",
    },
    paper: {
      padding: "1em",
    },
  }),
)

const firebaseUpload = async (ref: firebase.storage.Reference, file: any) => {
  if (file) {
    return ref.child(`images/${uuid()}-${file.name}`).put(file)
  }
}

const CourseEdit = ({ course }: { course: any }) => {
  const [
    storageRef,
    setStorageRef,
  ] = useState<firebase.storage.Reference | null>(null)

  const classes = useStyles()

  useEffect(() => {
    if (!firebase) {
      return
    }

    const storage = firebase.storage()
    setStorageRef(storage.ref())
  }, [firebase])

  if (!storageRef) {
    return null
  }

  return (
    <section>
      <Paper elevation={1} className={classes.paper}>
        <CourseEditForm
          course={course}
          firebaseUpload={(f: any) => firebaseUpload(storageRef, f)}
        />
      </Paper>
    </section>
  )
}

export default CourseEdit
