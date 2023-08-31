import {
  EnhancedButton,
  EnhancedButtonProps,
  Button as MUIButton,
} from "@mui/material"
import { css, styled } from "@mui/material/styles"

import ArrowRight from "../Icons/ArrowRight"

const ButtonText = styled("span")`
  margin: 12px 24px;
`

const EnhancedMUIButton = styled(MUIButton)(
  ({ theme, startIcon, href, color }) => `
  ${
    href
      ? color === "secondary"
        ? css`
            ${ButtonText} {
              margin: 12px 16px;
            }
            &.MuiButton-endIcon {
              padding-right: 1rem;
              padding-left: 0;
            }
          `.styles
        : css`
            ${ButtonText} {
              margin: 12px 0 12px 16px;
              padding-right: 16px;
              border-right: solid 1px ${theme.palette.common.additional.skyblue};
            }
            ,
            &.Mui-disabled {
              ${ButtonText} {
                border-right: solid 1px ${theme.palette.common.grayscale.dark};
              }
            }
          `.styles
      : ""
  }
  ${
    startIcon
      ? color === "secondary"
        ? css`
            ${ButtonText} {
              margin: 12px 16px;
            }
            &.MuiButton-startIcon {
              padding-left: 1rem;
              padding-right: 0;
            }
          `.styles
        : css`
            ${ButtonText} {
              margin: 12px 16px 12px 0;
              padding-left: 16px;
              border-left: solid 1px ${theme.palette.common.additional.skyblue};
            }
            &.Mui-disabled {
              ${ButtonText} {
                border-left: solid 1px ${theme.palette.common.grayscale.dark};
              }
            }
          `.styles
      : ""
  }
`,
) as EnhancedButton

const Button = ({
  children,
  ...props
}: React.PropsWithChildren<EnhancedButtonProps>) => {
  const { href } = props

  const endIcon: EnhancedButtonProps["endIcon"] =
    props.endIcon ?? (href ? <ArrowRight /> : undefined)

  return (
    <EnhancedMUIButton {...props} endIcon={endIcon}>
      <ButtonText>{children}</ButtonText>
    </EnhancedMUIButton>
  )
}

export default Button
