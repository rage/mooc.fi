import styled from "@emotion/styled"
import ButtonBase from "@material-ui/core/ButtonBase"

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

export const ClickableDiv = styled.div`
  position: relative;
  box-shadow: 18px 7px 28px -12px rgba(0, 0, 0, 0.41);

  &:hover {
    box-shadow: 18px 7px 48px -12px rgba(0, 0, 0, 1);
    transition-duration: 0.4s;
    cursor: pointer;
  }
`
