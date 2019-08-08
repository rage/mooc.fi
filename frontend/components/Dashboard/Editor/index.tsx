import React, { useCallback } from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import CourseEdit from "./Course"
import StudyModuleEdit from "./StudyModule"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      marginTop: "0.7em",
      marginBottom: "0.7em",
    },
  }),
)

const mapEditorComponent: { [key: string]: (props: any) => JSX.Element } = {
  Course: CourseEdit,
  StudyModule: StudyModuleEdit,
}

const Editor = ({ type, ...props }: { type: string; [key: string]: any }) => {
  const classes = useStyles()

  const EditorComponent: (props: any) => JSX.Element = mapEditorComponent[type]

  if (!EditorComponent) {
    return <div>Unknown editor component</div>
  }

  return (
    <section>
      <EditorComponent {...props} />
    </section>
  )
}

export default Editor
