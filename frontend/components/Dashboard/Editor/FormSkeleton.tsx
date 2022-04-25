import range from "lodash/range"

import styled from "@emotion/styled"
import { Container, Paper, Skeleton } from "@mui/material"

const FormContainer = styled((props: any) => (
  <Container spacing={4} {...props} />
))``

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
