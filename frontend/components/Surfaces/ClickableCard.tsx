import styled from "@emotion/styled"
import ButtonBase from "@mui/material/ButtonBase"

export const ClickableButtonBase = styled(ButtonBase)`
  background-color: white;
  position: relative;
  box-shadow: 18px 7px 28px -12px rgba(0, 0, 0, 0.41);

  &:hover {
    box-shadow: 18px 7px 48px -12px rgba(0, 0, 0, 1);
    transition-duration: 0.4s;
    cursor: pointer;
  }
`

export const ShadowedDiv = styled.div`
  position: relative;
  box-shadow: 18px 7px 28px -12px rgba(0, 0, 0, 0.41);
`

export const ClickableDiv = styled(ShadowedDiv)`
  &:hover {
    box-shadow: 18px 7px 48px -12px rgba(0, 0, 0, 1);
    transition-duration: 0.4s;
    cursor: pointer;
  }
`
