import React from "react"
import CourseEdit from "./Course"
import StudyModuleEdit from "./StudyModule"

const mapEditorComponent: { [key: string]: (props: any) => JSX.Element } = {
  Course: CourseEdit,
  StudyModule: StudyModuleEdit,
}

const Editor = ({ type, ...props }: { type: string; [key: string]: any }) => {
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
