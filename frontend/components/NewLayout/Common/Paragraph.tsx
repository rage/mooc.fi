import { PropsOf } from "@emotion/react"
import { styled } from "@mui/material/styles"

import { fontSize } from "/src/theme/util"

const ParagraphText = styled("div")(
  ({ theme }) => `
  ${fontSize(15, 22)}
  color: ${theme.palette.common.grayscale.darkText}
  letter-spacing: 0;
  width: 100%;

  ${theme.breakpoints.up("sm")} {
    ${fontSize(16, 24)}
  }
  ${theme.breakpoints.up("md")} {
    width: 91.46%;
  }
  ${theme.breakpoints.up("xl")} {
    width: 82.89%;
  }
  
  .paragraph__large {
    ${theme.breakpoints.up("lg")} {
      ${fontSize(17, 26)}
      width: 82.89%;
    }
    ${theme.breakpoints.up("xl")} {
      width: 91.46%;
    }
  }

  h1, &.MuiTypography-h1, 
  h2, &.MuiTypography-h2,
  h3, &.MuiTypography-h3,
  h4, &.MuiTypography-h4,
  h5, &.MuiTypography-h5,
  h6, &.MuiTypography-h6 {
    color: ${theme.palette.common.grayscale.black};
    font-weight: 700;
    margin: 0;
    width: 100%;
  }

  &.main_front_page,
  &.landing_page {
    h3, &.MuiTypography-h3 {
      ${fontSize(22, 28)}
      letter-spacing: -0.7px;
      ${theme.breakpoints.up("sm")} {
        ${fontSize(26, 32)}
        letter-spacing: -0.8px;
        padding-bottom: 16px;
        padding-top: 40px;
      }
      ${theme.breakpoints.up("md")} {
        padding-bottom: 16px;
        padding-top: 48px;
      }
    }

    h4, &.MuiTypography-h4 {
      ${fontSize(18, 24)};
      letter-spacing: -0.56px;
  
      padding-bottom: 12px;
      padding-top: 24px;
  
      ${theme.breakpoints.up("sm")} {
        ${fontSize(22, 28)};
        letter-spacing: -0.69px;
  
        padding-bottom: 16px;
        padding-top: 32px;
      }
  
      ${theme.breakpoints.up("md")} {
        padding-bottom: 16px;
        padding-top: 40px;
      }
    }
  
    h5, &.MuiTypography-h5 {
      ${fontSize(16, 20)};
      letter-spacing: -0.5px;
  
      padding-bottom: 12px;
      padding-top: 24px;
  
      ${theme.breakpoints.up("sm")} {
        ${fontSize(18, 24)};
        letter-spacing: -0.56px;
  
        padding-bottom: 16px;
        padding-top: 32px;
      }
  
      ${theme.breakpoints.up("md")} {
        padding-bottom: 16px;
        padding-top: 40px;
      }
    }
  
    h6 {
      ${fontSize(14, 16)};
      letter-spacing: -0.44px;
  
      padding-bottom: 12px;
      padding-top: 24px;
  
      ${theme.breakpoints.up("sm")} {
        ${fontSize(16, 20)};
        letter-spacing: -0.5px;
  
        padding-bottom: 16px;
        padding-top: 32px;
      }
  
      ${theme.breakpoints.up("md")} {
        padding-bottom: 16px;
        padding-top: 40px;
      }
    }
  
    ${theme.breakpoints.up("md")} {
      width: 100%;
    }
  }


  a {
    ${fontSize(14, 20)};
    color: ${theme.palette.common.link.blue};
    font-weight: 600;

    ${theme.breakpoints.up("sm")} {
      ${fontSize(16, 24)}
      letter-spacing: -0.1px;
    }

    ${theme.breakpoints.up("xl")} {
      ${fontSize(17, 26)}
    }

    &:hover {
      color: ${theme.palette.common.brand.main};
    }
  }

  a[target="_blank"]:after {
    display: inline-block;
    vertical-align: middle;
    width: 12px;
    height: 12px;
    margin-left: 3px;
    background-size: contain;
    content: "";
    background-image: url("data:image/svg+xml;utf8, <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 30 29' fill='rgb(4,121,165)'> <polygon points='29.207 13.783 14.756 .717 14.055 0 11.402 3.118 10.732 3.835 19.665 11.974 0 11.974 0 17.026 19.756 17.026 11.494 24.447 10.823 25.071 11.402 25.882 13.476 28.189 14.055 29 30 14.594' /> </svg>");
    transform: rotate(315deg);

    &:hover {
      background-image: url("data:image/svg+xml;utf8, <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 30 29' fill='pink'> <polygon points='29.207 13.783 14.756 .717 14.055 0 11.402 3.118 10.732 3.835 19.665 11.974 0 11.974 0 17.026 19.756 17.026 11.494 24.447 10.823 25.071 11.402 25.882 13.476 28.189 14.055 29 30 14.594' /> </svg>");
    }
  }

  a[target="_blank"]:hover {
    &:after {
      background-image: url("data:image/svg+xml;utf8, <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 30 29' fill='rgb(14,104,139)'> <polygon points='29.207 13.783 14.756 .717 14.055 0 11.402 3.118 10.732 3.835 19.665 11.974 0 11.974 0 17.026 19.756 17.026 11.494 24.447 10.823 25.071 11.402 25.882 13.476 28.189 14.055 29 30 14.594' /> </svg>");
    }
  }

  p {
    margin-top: 0;
    padding-top: 0;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &:first-child {
    margin-top: 0 !important;
  } 
`,
)

const Paragraph = ({
  children,
  ...props
}: React.PropsWithChildren<PropsOf<typeof ParagraphText>>) => (
  <ParagraphText {...props}>{children}</ParagraphText>
)

export default Paragraph
