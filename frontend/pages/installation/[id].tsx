import { useEffect, useMemo, useState } from "react"

import { MDXComponents } from "mdx/types"
import { GetStaticPropsContext } from "next"
import dynamic from "next/dynamic"
import Image from "next/image"

import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

// import NoOsMessage from "/components/Installation/NoOsMessage"
import OSSelector from "/components/Installation/OSSelector"
import Spinner from "/components/Spinner"
import UserOSContext from "/contexts/UserOSContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import InstallationTranslations from "/translations/installation"
import getUserOS, { UserOSType } from "/util/getUserOS"
import { useTranslator } from "/util/useTranslator"

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
    font-family: var(--open-sans-condensed-font), sans-serif !important;
    padding: 0.5rem;
    margin-top: 1rem;
  }
  h3 {
    font-size: 29px;
    line-height: 53px;
    font-family: var(--open-sans-condensed-font), sans-serif !important;
    text-decoration: underline;
    text-decoration-color: #00d2ff;
  }
  h4 {
    font-size: 23px;
    line-height: 44px;
    font-family: var(--open-sans-condensed-font), sans-serif !important;
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

// Not used now; tested what to do if we ever ditch using img in mdx
const ImageContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "width" && prop !== "height",
})<{ width: string; height: string }>`
  position: relative;
  width: ${(props) => props.width};
  height: ${(props) => props.height};

  @supports not (aspect-ratio: 16 / 9) {
    ::before {
      content: "";
      float: left;
      padding-top: 56.25%;
    }

    ::after {
      clear: left;
      content: "";
      display: block;
    }
  }

  @supports (aspect-ratio: 16 / 9) {
    aspect-ratio: 16 / 9;
  }
`

// Same as above
export const ContainedImage = ({ src, alt, ...props }: any) => {
  return (
    <ImageContainer {...props}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </ImageContainer>
  )
}

// @ts-ignore: used with MDXProvider, if used
const mdxComponents: MDXComponents = {
  Image: ContainedImage,
}

interface InstallationInstructionProps {
  paths: Record<UserOSType, string>
  id: (typeof allowedPaths)[number]
}

const InstallationInstructions = ({
  paths,
  id,
}: InstallationInstructionProps) => {
  const [userOS, setUserOS] = useState<UserOSType>("OS")

  const t = useTranslator(InstallationTranslations)

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
      return import(`../../public/md_pages/${paths?.[userOS]}`)
        .then((mdx) => mdx)
        .catch(() => {
          return () => <Spinner />
        })
    },
    { loading: () => <Spinner /> },
  )

  const contextValue = useMemo(() => ({ OS: userOS, changeOS }), [userOS])

  return (
    <UserOSContext.Provider value={contextValue}>
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
  "tmc-cli": {
    languages: { fi: "en", en: "en" },
    allowedOS: ["Windows", "macOS", "Linux"],
  },
  vscode: { allowedOS: ["Windows", "macOS", "Linux"] },
}

export async function getStaticPaths() {
  return {
    paths: allowedPaths.map((path) => ({ params: { id: path } })),
    fallback: "blocking",
  }
}

export async function getStaticProps({
  params,
  locale,
}: GetStaticPropsContext) {
  const id = ((Array.isArray(params?.id) ? params?.id[0] : params?.id) ??
    "") as (typeof allowedPaths)[number]
  const language = (locale ?? "fi") as (typeof languages)[number]
  if (!allowedPaths.includes(id)) {
    return { notFound: true }
  }

  const paths = {} as Record<UserOSType, string>

  allowedOS.forEach((os) => {
    const lang = combinationOverrides[id]?.languages?.[language] ?? language
    if (
      combinationOverrides[id] &&
      !combinationOverrides[id]?.allowedOS?.includes(os)
    ) {
      return
    }
    paths[os] = `${id}_installation_${os}_${lang}.mdx`
  })

  return {
    props: {
      paths,
      id,
    },
  }
}
