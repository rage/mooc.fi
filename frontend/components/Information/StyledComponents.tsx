import { styled } from "@mui/material/styles"

export const INFORMATION_COLUMN_MAX_WIDTH = "800px"

export const InformationContainer = styled("div")(
  ({ theme }) => `
  margin: 0 auto;
  max-width: 100%;
  padding: 0 1rem;

  ${theme.breakpoints.up("sm")} {
    padding: 0 2rem;
  }

  ${theme.breakpoints.up("lg")} {
    max-width: 1216px;
    padding: 0;
  }

  > * {
    max-width: ${INFORMATION_COLUMN_MAX_WIDTH};
    margin-left: auto;
    margin-right: auto;
  }

  h1 {
    text-transform: uppercase;
    font-size: clamp(1.75rem, 8vw, 2.625rem);
  }

  a {
    color: ${theme.palette.primary.main};
  }

  iframe {
    max-width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }
`,
)
