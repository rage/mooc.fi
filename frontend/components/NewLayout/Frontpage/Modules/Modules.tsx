import Link from "next/link"
import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import { Button } from "@mui/material"

import { SectionContainer, SectionTitle } from "/components/NewLayout/Common"
import {
  ModuleCard,
  ModuleCardSkeleton,
} from "/components/NewLayout/Frontpage/Modules/ModuleCard"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"
import notEmpty from "/util/notEmpty"

import { StudyModulesDocument } from "/graphql/generated"

const ModulesGrid = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  padding: 2rem;
  justify-content: center;
  width: 80%;
  @media (max-width: 500px) {
    padding: 0;
    width: 100%;
    grid-template-columns: 1fr;
  }
`

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

const Arrow = styled.div`
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

function Modules() {
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading, data } = useQuery(StudyModulesDocument, {
    variables: { language },
  })

  return (
    <SectionContainer>
      <SectionTitle>Opintokokonaisuudet</SectionTitle>
      <ModulesGrid>
        {loading && (
          <>
            <ModuleCardSkeleton key="module-skeleton-1" />
            <ModuleCardSkeleton key="module-skeleton-2" />
            <ModuleCardSkeleton key="module-skeleton-3" />
          </>
        )}
        {data?.study_modules?.filter(notEmpty).map((module, index) => (
          <ModuleCard key={`module-${index}`} module={module} hue={100} />
        ))}
      </ModulesGrid>
      <Link href="/_new/study-modules" passHref>
        <Button>Näytä kaikki kokonaisuudet</Button>
      </Link>
    </SectionContainer>
  )
}

export default Modules
