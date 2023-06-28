import { range } from "remeda"

import { Container, Paper, Skeleton } from "@mui/material"
import { styled } from "@mui/material/styles"

const FormBackground = styled(Paper)`
  padding: 1em;
`

const FormSkeleton: React.FC = () => (
  <Container maxWidth="md">
    <FormBackground elevation={1}>
      {range(0, 10).map((idx) => (
        <Skeleton key={`skeleton-${idx}`} sx={{ marginBottom: "2em" }} />
      ))}
    </FormBackground>
  </Container>
)

export default FormSkeleton
