import { useEffect, useMemo, useState } from "react"

import { MDXComponents } from "mdx/types"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { MDXProvider } from "@mdx-js/react"
import { Link as MUILink, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import ModalImage from "/components/Images/ModalImage"
// import NoOsMessage from "/components/Installation/NoOsMessage"
import OSSelector from "/components/Installation/OSSelector"
import Spinner from "/components/Spinner"
import UserOSContext from "/contexts/UserOSContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useTranslator } from "/hooks/useTranslator"
import InstallationTranslations from "/translations/installation"
import getUserOS, { UserOSType } from "/util/getUserOS"

const Background = styled("section")`
  padding-top: 2em;
  padding-left: 1em;
  padding-right: 1em;
  padding-bottom: 2em;
  background-color: #ffc107;
`

const Title = styled(Typography)`
  margin-bottom: 0.4em;
  padding: 1rem;
` as typeof Typography

const TitleBackground = styled("div")`
  background-color: white;
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1em;
`

const Content = styled("div")`
  position: relative;
`

export const SectionBox = styled("div")`
  margin-bottom: 6rem;
`

export const ContentBox = styled("div")`
  background-color: white;
  max-width: 39em;
  border: 3px solid black;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  padding: 2em;
  padding-top: 5em;
  margin-top: 1em;
  font-size: 18px;
  line-height: 37px;
  h2 {
    font-size: 37px;
    line-height: 64px;
    font-family: var(--header-font), sans-serif !important;
    padding: 0.5rem;
    margin-top: 1rem;
  }
  h3 {
    font-size: 29px;
    line-height: 53px;
    font-family: var(--header-font), sans-serif !important;
    text-decoration: underline;
    text-decoration-color: #00d2ff;
  }
  h4 {
    font-size: 23px;
    line-height: 44px;
    font-family: var(--header-font), sans-serif !important;
  }
  code {
    background-color: #e6f4f1;
    padding: 0.5rem;
    font-size: smaller;
  }
  img {
    margin-top: 1rem;
    margin-bottom: 1rem;
    background-color: #c3fcf2;
    padding: 1.5rem;
  }
`

export const CodeBox = styled("div")`
  background-color: #e6f4f1;
  padding: 0.5rem;
  margin-left: 2.5rem;

  pre {
    white-space: break-spaces;
    overflow-x: hidden;
    margin: 0.5rem;
  }

  code {
    background-color: unset;
    font-size: clamp(14px, 1.5vw, 15px);
  }
`

export const Note = styled("section")`
  padding: 1em;
  background-color: #eeeeee;
  font-size: 16px;
`

export const Link = MUILink

const mdxComponents: MDXComponents = {
  a: Link as (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
  ) => React.JSX.Element,
  img: ({ src, ...props }: any) => (
    <ModalImage
      src={require(`/public/images/installation/${src}`)}
      {...props}
    />
  ),
}
const InstallationInstructions = () => {
  const [userOS, setUserOS] = useState<UserOSType>("OS")
  const router = useRouter()
  const id = router.query.id?.toString() as (typeof allowedPaths)[number]
  const language = router.locale ?? "en"

  const t = useTranslator(InstallationTranslations)

  const paths = useMemo(() => {
    const paths = {} as Record<UserOSType, string>

    allowedOS.forEach((os) => {
      // @ts-expect-error: type is not specific enough
      const lang = combinationOverrides[id]?.languages?.[language] ?? language
      if (!combinationOverrides[id]?.allowedOS?.includes(os)) {
        return
      }
      paths[os] = `${id}_installation_${os}_${lang}.mdx`
    })
    return paths
  }, [combinationOverrides, id, language])

  useBreadcrumbs([
    {
      translation: "installation",
    },
    {
      label: breadcrumbLabels[id],
      href: `/installation/${id as string}`,
    },
  ])

  const changeOS = (OS: UserOSType) => {
    setUserOS(OS)
  }

  useEffect(() => {
    setUserOS(getUserOS())
  }, [])

  const excludeZip = !combinationOverrides[id]?.allowedOS?.includes("ZIP")

  const Component = dynamic(
    async () => {
      return import(`../../public/md_pages/installation/${paths?.[userOS]}`)
        .then((mdx) => mdx)
        .catch(() => {
          return Spinner
        })
    },
    { loading: Spinner },
  )

  const contextValue = useMemo(() => ({ OS: userOS, changeOS }), [userOS])

  return (
    <UserOSContext.Provider value={contextValue}>
      <MDXProvider components={mdxComponents}>
        <Background>
          <TitleBackground>
            <Title component="h1" variant="h1" align="center">
              {t("title")}
            </Title>
          </TitleBackground>
          <TitleBackground style={{ width: "45%", marginBottom: "8em" }}>
            <Title component="p" variant="subtitle1" align="center">
              {t("subtitle")}
            </Title>
          </TitleBackground>
          <Content>
            {userOS ? (
              <>
                <OSSelector excludeZip={excludeZip} />
                <Component />
              </>
            ) : (
              <Spinner />
            )}
          </Content>
        </Background>
      </MDXProvider>
    </UserOSContext.Provider>
  )
}

export default InstallationInstructions

const allowedPaths = ["netbeans", "tmc-cli", "vscode"] as const
const allowedOS: readonly UserOSType[] = [
  "Linux",
  "macOS",
  "Windows",
  "ZIP",
] as const
const languages = ["en", "fi"] as const
const breadcrumbLabels: Record<(typeof allowedPaths)[number], string> = {
  netbeans: "Netbeans",
  "tmc-cli": "TMC Client",
  vscode: "VSCode",
}

interface CombinationOverride {
  languages?: { [key in (typeof languages)[number]]: string }
  allowedOS?: Array<(typeof allowedOS)[number]>
}

const combinationOverrides: {
  [K in (typeof allowedPaths)[number]]?: CombinationOverride
} = {
  netbeans: {
    languages: { fi: "fi", en: "en" },
    allowedOS: ["Windows", "macOS", "Linux"],
  },
  "tmc-cli": {
    languages: { fi: "en", en: "en" },
    allowedOS: ["Windows", "macOS", "Linux"],
  },
  vscode: { allowedOS: ["Windows", "macOS", "Linux"] },
}

// export async function getServerSideProps({
//   params,
//   locale,
// }: GetServerSidePropsContext) {
//   const id = ((Array.isArray(params?.id) ? params?.id[0] : params?.id) ??
//     "") as (typeof allowedPaths)[number]
//   const language = (locale ?? "fi") as (typeof languages)[number]
//   if (!allowedPaths.includes(id)) {
//     return { notFound: true }
//   }

//   const paths = {} as Record<UserOSType, string>

//   allowedOS.forEach((os) => {
//     const lang = combinationOverrides[id]?.languages?.[language] ?? language
//     if (!combinationOverrides[id]?.allowedOS?.includes(os)) {
//       return
//     }
//     paths[os] = `${id}_installation_${os}_${lang}.mdx`
//   })

//   return {
//     props: {
//       paths,
//       id,
//     },
//   }
// }
