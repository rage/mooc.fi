import HomeTranslations from "/translations/home"
import { useTranslator } from "/util/useTranslator"
import Link from "next/link"
import { useRouter } from "next/router"

import styled from "@emotion/styled"
import {
  faFacebook,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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
  padding: 1.5rem 0;
`

const EmailContainer = styled.div`
  padding-top: 2rem;
`

const MaintainedContainer = styled.div`
  a {
    color: white;
  }
`

const BottomRowContainer = styled.div`
  padding: 1.5rem 0;
  display: flex;
  flex-direction: row;
  padding: 2rem 0;
`
const PolicyContainer = styled.div`
  :before {
    content: "|";
    margin-right: 0.5rem;
  }
  margin-left: 0.5rem;
  a {
    color: white;
  }
`

const LogoImage = styled.img`
  height: 75;
`

function UniversityLogo() {
  return (
    <picture>
      <source
        srcSet={require(`../static/images/uh-logo.png?webp`)}
        type="image/webp"
      />
      <source
        srcSet={require(`../static/images/uh-logo.png`)}
        type="image/png"
      />
      <LogoImage
        alt="Logo of the University of Helsinki"
        src={require(`../static/images/uh-logo.png`)}
        loading="lazy"
      />
    </picture>
  )
}

function Footer() {
  const t = useTranslator(HomeTranslations)
  const { locale } = useRouter()

  return (
    <FooterBar>
      <EmailContainer>mooc@cs.helsinki.fi</EmailContainer>
      <UniversityLogo />
      <SocialContainer>
        <a
          aria-label="MOOC.fi twitter"
          href="https://twitter.com/moocfi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <StyledIcon icon={faTwitter} size="3x" />
        </a>
        <a
          aria-label="MOOC.fi Facebook"
          href="https://www.facebook.com/Moocfi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <StyledIcon icon={faFacebook} size="3x" />
        </a>
        <a
          aria-label="MOOC.fi Youtube channel"
          href="https://www.youtube.com/channel/UCkHoQ5p9skFdyjrV3_tnUrA"
          target="_blank"
          rel="noopener noreferrer"
        >
          <StyledIcon icon={faYoutube} size="3x" />
        </a>
      </SocialContainer>
      <BottomRowContainer>
        <MaintainedContainer>
          This site is maintained by the{" "}
          <a
            aria-label="Rage research group homepage"
            href="https://www.helsinki.fi/en/researchgroups/data-driven-education"
            target="_blank"
            rel="noopener noreferrer"
          >
            RAGE research group
          </a>
          .
        </MaintainedContainer>
        {locale === "fi" && (
          <PolicyContainer>
            <Link href={t("privacyPolicyLink")}>{t("privacyPolicy")}</Link>
          </PolicyContainer>
        )}
      </BottomRowContainer>
    </FooterBar>
  )
}

export default Footer
