import React from "react"
import styled from "styled-components"
import { Container, Paper } from "@material-ui/core"
import Skeleton from "@material-ui/lab/Skeleton"
import { range } from "lodash"

const FormContainer = styled(Container)`
  spacing: 4;
`

const FormBackground = styled(Paper)`
  padding: 1em;
`

const FormSkeleton: React.FC = () => (
  <FormContainer maxWidth="md">
    <FormBackground elevation={1}>
      {range(10).map((idx) => (
        <Skeleton key={`skeleton-${idx}`} style={{ marginBottom: "2em" }} />
      ))}
    </FormBackground>
  </FormContainer>
)

export default FormSkeleton
