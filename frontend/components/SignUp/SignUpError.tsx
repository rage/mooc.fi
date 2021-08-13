import { StyledPaper, Header, StyledTypography } from "./common"

interface SignUpErrorProps {
  type?: string
}

function SignUpError({ type }: SignUpErrorProps) {
  return (
    <StyledPaper>
      <Header component="h1" variant="h4" gutterBottom={true} align="center">
        Error
      </Header>
      <StyledTypography component="p" paragraph>
        {type}
      </StyledTypography>
    </StyledPaper>
  )
}

export default SignUpError
