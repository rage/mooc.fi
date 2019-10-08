import React from "react"
import CompletionListItem from "/components/CompletionListItem"

interface CompletionsProps {
  completions: any[]
}
const ProfileCompletionsDisplay = (props: CompletionsProps) => {
  const { completions } = props
  console.log(completions)
  return (
    <>
      {completions.map(c => (
        <CompletionListItem listItem={c} key={c.id} />
      ))}
    </>
  )
}

export default ProfileCompletionsDisplay
