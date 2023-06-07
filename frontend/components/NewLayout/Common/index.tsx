import { Typography, TypographyProps } from "@mui/material"
import { styled } from "@mui/material/styles"

export const SectionTitle = (props: TypographyProps) => (
  <Typography variant="h1" {...props} />
)

export const SectionContainer = styled("section")(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  padding-top: 2rem;
  margin: auto;

  ${theme.breakpoints.down("xs")} {
    margin: 0;
  }
`,
)

export const CorrectedAnchor = styled(
  (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div tabIndex={-1} {...props} />
  ),
)`
  display: block;
  position: relative;
  top: -120px;
  visibility: hidden;
`
