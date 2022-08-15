import { range } from "lodash"

import styled from "@emotion/styled"
import { Container, Paper, Skeleton } from "@mui/material"

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
