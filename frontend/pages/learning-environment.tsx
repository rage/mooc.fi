import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { InformationContainer } from "/components/Information/StyledComponents"
import Spinner from "/components/Spinner"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"

const LearningEnvironmentPage = () => {
  useBreadcrumbs([
    {
      translation: "learningEnvironment",
      href: `/learning-environment`,
    },
  ])

  const { locale } = useRouter()

  const Content = dynamic(
    async () => {
      return import(
        `../public/md_pages/information/learning_environment_${
          locale ?? "fi"
        }.mdx`
      )
        .then((mdx) => mdx)
        .catch(() => {
          return Spinner
        })
    },
    { loading: Spinner },
  )

  return <InformationContainer>{<Content />}</InformationContainer>
}

export default LearningEnvironmentPage
