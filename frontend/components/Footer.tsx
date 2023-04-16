import Image from "next/image"
import { useRouter } from "next/router"

import Facebook from "@fortawesome/fontawesome-free/svgs/brands/facebook.svg?icon"
import Twitter from "@fortawesome/fontawesome-free/svgs/brands/twitter.svg?icon"
import Youtube from "@fortawesome/fontawesome-free/svgs/brands/youtube.svg?icon"
import { Link } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import HomeTranslations from "/translations/home"

const IconBaseStyle = css`
  fill: white;
  margin-bottom: 1rem;
  margin: 1rem;
  font-size: 48px;
`

const TwitterIcon = styled(Twitter)`
  ${IconBaseStyle};
`

const FacebookIcon = styled(Facebook)`
  ${IconBaseStyle};
`

const YoutubeIcon = styled(Youtube)`
  ${IconBaseStyle};
`

const FooterBar = styled("footer")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #202124 !important;
  color: white;
  padding: 1rem;
  text-align: center;
`

const SocialContainer = styled("div")`
  padding: 1.5rem 0;
`

const EmailContainer = styled("div")`
  padding-top: 2rem;
`

const MaintainedContainer = styled("div")`
  a {
    color: white;
  }
`

const BottomRowContainer = styled("div")`
  padding: 1.5rem 0;
  display: flex;
  flex-direction: row;
  padding: 2rem 0;
`
const PolicyContainer = styled("div")`
  :before {
    content: "|";
    margin-right: 0.5rem;
  }
  margin-left: 0.5rem;
  a {
    color: white;
  }
`

/*const LogoImage = styled.img`
  height: 75;
`*/

function UniversityLogo() {
  return (
    <Image
      src="/images/uh-logo.webp"
      alt="Logo of the University of Helsinki"
      width={188}
      height={75}
    />
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
        <Link
          aria-label="MOOC.fi twitter"
          href="https://twitter.com/moocfi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon />
        </Link>
        <Link
          aria-label="MOOC.fi Facebook"
          href="https://www.facebook.com/Moocfi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon />
        </Link>
        <Link
          aria-label="MOOC.fi Youtube channel"
          href="https://www.youtube.com/channel/UCkHoQ5p9skFdyjrV3_tnUrA"
          target="_blank"
          rel="noopener noreferrer"
        >
          <YoutubeIcon />
        </Link>
      </SocialContainer>
      <BottomRowContainer>
        <MaintainedContainer>
          This site is maintained by the{" "}
          <Link
            aria-label="Rage research group homepage"
            href="https://www.helsinki.fi/en/researchgroups/data-driven-education"
            target="_blank"
            rel="noopener noreferrer"
          >
            RAGE research group
          </Link>
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
