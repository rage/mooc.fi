import { styled } from "@mui/material/styles"

const ContentWrapper = styled("div")(
  ({ theme }) => `
  margin: 0 auto;
  max-width: 100%;
  padding: 0 1rem;
  position: relative;

  ${theme.breakpoints.up("sm")} {
    padding: 0 2rem;
  }

  ${theme.breakpoints.up("lg")} {
    max-width: 1216px;
    padding: 0;
  }
`,
)

export default ContentWrapper
