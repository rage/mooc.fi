import React from "react"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"

const TitleText = styled(Typography)`
  margin-top: 0.5em;
  margin-bottom: 0.35em;
`

function Title({ titleText }: { titleText: string }) {
  return (
    <>
      <TitleText component="h1" variant="h2" align="center" gutterBottom={true}>
        {titleText}
      </TitleText>
    </>
  )
}

export default Title
