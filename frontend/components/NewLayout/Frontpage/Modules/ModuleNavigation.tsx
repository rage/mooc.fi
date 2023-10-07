import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"

import ContentWrapper from "../../Common/ContentWrapper"
import CTAButton from "../../Common/CTAButton"
import Introduction from "../../Common/Introduction"
import ModuleNaviList from "./ModuleNaviList"
import { useTranslator } from "/hooks/useTranslator"
import HomeTranslations from "/translations/home"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

import { StudyModulesDocument } from "/graphql/generated"

/*const ShowMore = styled(Button)`
  --color: #eee;
  --height: calc(50px + 1rem);
  --half-height: calc(25px + 0.5rem);
  position: relative;
  text-align: center;
  background: var(--color);
  height: var(--height);
  vertical-align: middle;
  padding-left: 3rem;
  padding-right: 3rem;
  align-items: center;
  display: flex;

  &:after {
    content: "";
    position: absolute;
    border-left: var(--half-height) solid var(--color);
    border-right: var(--half-height) solid transparent;
    border-top: var(--half-height) solid transparent;
    border-bottom: var(--half-height) solid transparent;
    right: calc(var(--height) * -1 + 10px);
    top: 0px;
    width: 0;
    height: 0;
    display: block;
  }

  &:hover {
    --color: #aaa;
    transition-duration: 0.4s;
    filter: drop-shadow(18px 7px 48px -12px rgba(0, 0, 0, 1));
    cursor: pointer;
  }

  &:hover:after {
    --color: #aaa;
    transition-duration: 0.4s;
    filter: drop-shadow(18px 7px 48px -12px rgba(0, 0, 0, 1));
  }
`

const Arrow = styled("div")`
  width: 120%;
  &:before {
    content: "";
    margin-top: 14px;
    width: calc(100% - 30px);
    background: blue;
    height: 10px;
    float: left;
  }

  &:after {
    content: "";
    width: 30px;
    height: 0;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 30px solid blue;
    float: right;
  }
`*/

export function ModuleNavigation() {
  const { locale = "fi" } = useRouter()
  const t = useTranslator(HomeTranslations)
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading, data } = useQuery(StudyModulesDocument, {
    variables: { language },
  })

  return (
    <section id="modules">
      <Introduction title={t("studyModulesTitle")} />
      <ContentWrapper>
        <ModuleNaviList modules={data?.study_modules} loading={loading} />
        <CTAButton href="/study-modules">{t("showAllModules")}</CTAButton>
      </ContentWrapper>
    </section>
  )
}
