import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"
import styled from "@emotion/styled"
import { Typography } from "@mui/material"

const SkipLinkContainer = styled.a`
  left: -999;
  position: absolute;
  top: auto;
  height: 1;
  width: 1;
  overflow: hidden;
  z-index: -999;

  &:focus {
    color: white;
    background-color: black;
    left: auto;
    top: auto;
    width: 30%;
    height: auto;
    overflow: auto;
    margin: 10;
    padding: 5;
    border-radius: 15;
    text-align: center;
    font-size: 1.2em;
    z-index: 999;
  }

  &:active {
    color: white;
    background-color: black;
    left: auto;
    top: auto;
    width: 30%;
    height: auto;
    overflow: auto;
    margin: 10;
    padding: 5;
    border-radius: 15;
    text-align: center;
    font-size: 1.2em;
    z-index: 999;
  }
`

function SkipLink() {
  const t = useTranslator(CommonTranslations)

  return (
    <SkipLinkContainer href="#main">
      <Typography variant="body1">{t("skiplink")}</Typography>
    </SkipLinkContainer>
  )
}

export default SkipLink
