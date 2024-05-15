import { useRouter } from "next/router"

import { Link, Skeleton } from "@mui/material"
import { styled } from "@mui/material/styles"

import ContentWrapper from "../Common/ContentWrapper"
import CaretRightIcon from "../Icons/CaretRight"
import { Breadcrumb, useBreadcrumbContext } from "/contexts/BreadcrumbContext"
import { useTranslator } from "/hooks/useTranslator"
import { fontSize } from "/src/theme/util"
import { isTranslationKey } from "/translations"
import BreadcrumbsTranslations, {
  Breadcrumbs as BreadcrumbsTranslationType,
} from "/translations/breadcrumbs"

const BreadcrumbContainer = styled("nav")`
  display: inline-block;
  position: relative;
  width: auto;
`

const BreadcrumbList = styled("ol")(
  ({ theme }) => `
  margin: 0;
  color: ${theme.palette.common.grayscale.dark};
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 20px 0 16px;

  ${theme.breakpoints.up("sm")} {
    padding: 24px 0 16px;
  }

  ${theme.breakpoints.up("xl")} {
    padding: 32px 0 16px;
  }
`,
)

interface BreadcrumbItemComponentProps {
  isCurrent?: boolean
}
const BreadcrumbItemComponent = styled("li")<BreadcrumbItemComponentProps>(
  ({ theme, isCurrent }) => `
  ${fontSize(15, 20)}
  font-weight: 600;
  display: "flex";
  align-items: center;
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;

  ${theme.breakpoints.up("sm")} {
    margin-bottom: 1rem;
  }

  a {
    color: ${isCurrent
      ? theme.palette.common.grayscale.dark
      : theme.palette.common.brand.light
    };
    ${isCurrent ? "display: block;" : ""}
    text-decoration: none;

    &:hover {
      color: ${theme.palette.common.brand.active};
    }
  }

  svg {
    margin: 0 21px;
  }
`,
)

interface BreadcrumbItemProps
  extends BreadcrumbItemComponentProps,
  Breadcrumb { }

const BreadcrumbItem = ({ isCurrent, ...item }: BreadcrumbItemProps) => {
  const t = useTranslator(BreadcrumbsTranslations)
  const { translation, label, href } = item
  const _translation = isTranslationKey<BreadcrumbsTranslationType>(translation)
    ? t(translation)
    : translation

  const text = label ?? _translation

  return (
    <BreadcrumbItemComponent isCurrent={isCurrent}>
      <Link href={href ?? "#"}>{text ?? <Skeleton width="100px" />}</Link>
      {!isCurrent && <CaretRightIcon sx={{ fontSize: "12px" }} />}
    </BreadcrumbItemComponent>
  )
}

const Breadcrumbs = () => {
  const { asPath } = useRouter()
  const { breadcrumbs } = useBreadcrumbContext()

  const isHomePage = !!RegExp(/^(?:\/_old)?\/?$/).exec(
    asPath?.replace(/#(.*)/, ""),
  )

  if (isHomePage) {
    return null
  }

  return (
    <ContentWrapper>
      <BreadcrumbContainer
        role="navigation"
        aria-labelledby="system-breadcrumb"
        aria-label="breadcrumb"
      >
        <BreadcrumbList>
          <BreadcrumbItem translation="home" href="/" key="home" />
          {breadcrumbs.map((breadcrumb, index) => (
            <BreadcrumbItem
              key={breadcrumb.href ?? breadcrumb.label ?? `breadcrumb-${index}`}
              isCurrent={index === breadcrumbs.length - 1}
              {...breadcrumb}
            />
          ))}
        </BreadcrumbList>
      </BreadcrumbContainer>
    </ContentWrapper>
  )
}

export default Breadcrumbs
