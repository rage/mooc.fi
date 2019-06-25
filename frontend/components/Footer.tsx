import React from "react"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import NextI18Next from "../i18n"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import {
  faTwitter,
  faFacebook,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons"

const StyledIcon = styled(FontAwesomeIcon)`
  color: white;
  margin-bottom: 1rem;
  margin: 1rem;
`

const FooterBar = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #202124 !important;
  color: white;
  padding: 1rem;
  text-align: center;
`

const SocialContainer = styled.div`
  padding: 2rem 0;
`

const EmailContainer = styled.div`
  padding-top: 2rem;
`

const MaintainedContainer = styled.div`
  padding: 2rem 0;
  a {
    color: white;
  }
`

function UniversityLogo(props: any) {
  const classes = useStyles()
  return (
    <img
      alt="Logo of the University of Helsinki"
      src="../static/images/uh-logo.png"
      className={classes.logoImage}
    />
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logoImage: {
      height: 75,
    },
  }),
)
function Footer() {
  return (
    <FooterBar>
      <EmailContainer>mooc@cs.helsinki.fi</EmailContainer>
      <UniversityLogo />
      <SocialContainer>
        <a
          href="https://twitter.com/moocfi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <StyledIcon icon={faTwitter} size="3x" />
        </a>
        <a
          href="https://www.facebook.com/Moocfi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <StyledIcon icon={faFacebook} size="3x" />
        </a>
        <a
          href="https://www.youtube.com/channel/UCkHoQ5p9skFdyjrV3_tnUrA"
          target="_blank"
          rel="noopener noreferrer"
        >
          <StyledIcon icon={faYoutube} size="3x" />
        </a>
      </SocialContainer>
      <MaintainedContainer>
        This site is maintained by the{" "}
        <a
          href="https://www.helsinki.fi/en/researchgroups/data-driven-education"
          target="_blank"
          rel="noopener noreferrer"
        >
          RAGE research group
        </a>
        .
      </MaintainedContainer>
    </FooterBar>
  )
}

export default NextI18Next.withTranslation("common")(Footer)
