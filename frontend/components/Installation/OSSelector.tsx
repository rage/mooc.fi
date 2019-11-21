import React from "react"
import OSSelectorButton from "./OSSelectorButton"
import styled from "styled-components"

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: row;
  max-width: 50%;
  border-radius: 10px;
  border: 1.5px solid #ffc107;
`
interface Props {
  OS: string
}
const OSSelector = (props: Props) => {
  const { OS } = props
  console.log(OS)
  return (
    <Container>
      <OSSelectorButton OSName="Linux" />
      <OSSelectorButton OSName="Windows" />
      <OSSelectorButton OSName="MAC" />
    </Container>
  )
}

export default OSSelector
