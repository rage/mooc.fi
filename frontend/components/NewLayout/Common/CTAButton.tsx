import {
  ButtonBase,
  EnhancedButtonBase,
  EnhancedButtonBaseProps,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import ArrowRight from "../Icons/ArrowRight"
import { fontSize } from "/src/theme/util"

const ctaButtonVariants = [
  "transparent-background",
  "black-background",
  "white-background",
  "blue-background",
  "hero-white",
  "hero-blue",
  "hero-black",
  "dark-blue-background",
] as const

export type CTAButtonVariant = (typeof ctaButtonVariants)[number]

const EnhancedMUIButton = styled(ButtonBase)(
  ({ theme }) => `
    cursor: pointer;
    font-weight: 700;
    position: relative;
    text-decoration: none;

    &.transparent-background,
    &.black-background,
    &.blue-background,
    &.white-background,
    &.hero-white,
    &.hero-blue,
    &.hero-black,
    &.dark-blue-background {
      align-items: center;
      box-sizing: border-box;
      display: flex;
      height: 100%;
      justify-content: center;
      max-width: 328px;
      padding: 13px 16px;
  
      .text {
        ${fontSize(16, 18)}
        letter-spacing: -0.3px;
      }
  
      .link-icon {
        display: flex;
        margin-left: 8px;
  
        svg {
          height: 16px;
          width: 16px;
        }
      }
    }

    &.dark-blue-background {
      background-color: ${theme.palette.common.brand.dark};
      border: 4px solid ${theme.palette.common.grayscale.white};
      color: ${theme.palette.common.grayscale.white};
  
      .link-icon svg {
        background-color: ${theme.palette.common.brand.dark};
        fill: ${theme.palette.common.grayscale.white};
      }
  
      .text {
        color: ${theme.palette.common.grayscale.white};
      }
    }

    &.transparent-background {
      background-color: ${theme.palette.common.grayscale.white};
      border: 4px solid ${theme.palette.common.grayscale.black};
      color: ${theme.palette.common.grayscale.black};
  
      .link-icon svg {
        background-color: ${theme.palette.common.grayscale.white};
        fill: ${theme.palette.common.grayscale.black};
      }
  
      .text {
        color: ${theme.palette.common.grayscale.black};
      }
    }

    &.black-background {
      background-color: ${theme.palette.common.grayscale.black};
      border: 4px solid ${theme.palette.common.grayscale.white};
      color: ${theme.palette.common.grayscale.white};
  
      .link-icon svg {
        background-color: ${theme.palette.common.grayscale.black};
        fill: ${theme.palette.common.grayscale.white};
      }
  
      .text {
        color: ${theme.palette.common.grayscale.white};
      }
  
      &:hover {
        background-color: ${theme.palette.common.brand.active};
  
        .link-icon svg {
          background-color: ${theme.palette.common.brand.active};
        }
      }
  
      &:focus {
        background-color: ${theme.palette.common.brand.main};
  
        .link-icon svg {
          background-color: ${theme.palette.common.brand.main};
        }
      }
    }
  
    &.blue-background {
      background-color: ${theme.palette.common.brand.light};
      border: 4px solid ${theme.palette.common.grayscale.white};
      color: ${theme.palette.common.grayscale.white};
  
      .link-icon svg {
        background-color: ${theme.palette.common.brand.light};
        fill: ${theme.palette.common.grayscale.white};
      }
  
      .text {
        color: ${theme.palette.common.grayscale.white};
      }
  
      &:hover {
        background-color: ${theme.palette.common.brand.main};
  
        .link-icon svg {
          background-color: ${theme.palette.common.brand.main};
        }
      }
  
      &:focus {
        background-color: ${theme.palette.common.brand.active};
  
        .link-icon svg {
          background-color: ${theme.palette.common.brand.active};
        }
      }
    }
  
    &.white-background {
      background-color: ${theme.palette.common.grayscale.white};
      border: 4px solid ${theme.palette.common.brand.light};
      color: ${theme.palette.common.brand.light};
  
      .link-icon svg {
        background-color: ${theme.palette.common.grayscale.white};
        fill: ${theme.palette.common.brand.light};
      }
  
      .text {
        color: ${theme.palette.common.brand.light};
      }
  
      &:hover {
        border-color: ${theme.palette.common.brand.active};
  
        .text {
          color: ${theme.palette.common.brand.active};
        }
  
        .link-icon svg {
          fill: ${theme.palette.common.brand.active};
        }
      }
  
      &:focus {
        border-color: ${theme.palette.common.brand.active};
  
        .text {
          color: ${theme.palette.common.brand.active};
        }
  
        .link-icon svg {
          fill: ${theme.palette.common.brand.active};
        }
      }
    }
  
    &.hero-white {
      background-color: ${theme.palette.common.brand.light};
      color: ${theme.palette.common.grayscale.white};
  
      .link-icon svg {
        background-color: ${theme.palette.common.brand.light};
        fill: ${theme.palette.common.grayscale.white};
      }
  
      .text {
        color: ${theme.palette.common.grayscale.white};
      }
  
      &:hover {
        background-color: ${theme.palette.common.brand.active};
  
        .link-icon svg {
          background-color: ${theme.palette.common.brand.active};
        }
      }
  
      &:focus {
        background-color: ${theme.palette.common.brand.active};
  
        .link-icon svg {
          background-color: ${theme.palette.common.brand.active};
        }
      }
    }
  
    &.hero-black {
      background-color: ${theme.palette.common.grayscale.black};
      border: 4px solid ${theme.palette.common.grayscale.white};
      color: ${theme.palette.common.grayscale.white};
  
      .link-icon svg {
        background-color: ${theme.palette.common.grayscale.black};
        fill: ${theme.palette.common.grayscale.white};
      }
  
      .text {
        color: ${theme.palette.common.grayscale.white};
      }
  
      &:hover {
        border-color: ${theme.palette.common.brand.soft};
  
        .text {
          color: ${theme.palette.common.brand.soft};
        }
  
        .link-icon svg {
          fill: ${theme.palette.common.brand.soft};
        }
      }
  
      &:focus {
        border-color: ${theme.palette.common.brand.soft};
  
        .text {
          color: ${theme.palette.common.brand.soft};
        }
  
        .link-icon svg {
          fill: ${theme.palette.common.brand.soft};
        }
      }
    }
  
    &.hero-blue {
      background-color: ${theme.palette.common.brand.main};
      border: 4px solid ${theme.palette.common.grayscale.white};
      color: ${theme.palette.common.grayscale.white};
  
      .link-icon svg {
        background-color: ${theme.palette.common.brand.main};
        fill: ${theme.palette.common.grayscale.white};
      }
  
      .text {
        color: ${theme.palette.common.grayscale.white};
      }
  
      &:hover {
        border-color: ${theme.palette.common.brand.soft};
  
        .text {
          color: ${theme.palette.common.brand.soft};
        }
  
        .link-icon svg {
          fill: ${theme.palette.common.brand.soft};
        }
      }
  
      &:focus {
        border-color: ${theme.palette.common.brand.soft};
  
        .text {
          color: ${theme.palette.common.brand.soft};
        }
  
        .link-icon svg {
          fill: ${theme.palette.common.brand.soft};
        }
      }
    }
  `,
) as EnhancedButtonBase

export interface CTAButtonProps extends EnhancedButtonBaseProps {
  variant?: CTAButtonVariant
}

const CTAButton = ({ variant, children, ...props }: CTAButtonProps) => {
  const buttonVariant = variant ?? "blue-background"

  return (
    <EnhancedMUIButton
      {...props}
      className={`${props.className ?? ""} ${buttonVariant}`}
    >
      <span className="text">{children}</span>
      <span className="link-icon">
        <ArrowRight sx={{ fontSize: "48px" }} />
      </span>
    </EnhancedMUIButton>
  )
}

export default CTAButton
