import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const SkipLinkContainer = styled("a")`
  left: -999px;
  position: absolute;
  top: auto;
  height: 1px;
  width: 1px;
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
    <SkipLinkContainer id="skiplink" href="#main">
      <Typography variant="body1">{t("skiplink")}</Typography>
    </SkipLinkContainer>
  )
}

export default SkipLink
