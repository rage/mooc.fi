import { useRouter } from "next/router"
import { range, sample } from "remeda"

import { useQuery } from "@apollo/client"
import { Button, Typography, TypographyProps } from "@mui/material"
import { styled } from "@mui/material/styles"

import ContentWrapper from "../Common/ContentWrapper"
import CTAButton from "../Common/CTAButton"
import Introduction from "../Common/Introduction"
import {
  CardBody,
  CardDescription,
  CardHeaderImage,
  CardWrapper,
} from "/components/NewLayout/Common/Card"
import CommonCourseCard, {
  CourseCardSkeleton,
} from "/components/NewLayout/Courses/CourseCard"
import { CardTitle } from "/components/Text/headers"
import { useTranslator } from "/hooks/useTranslator"
import moocLogo from "/public/images/new/logos/moocfi-transparent.svg"
import HomeTranslations from "/translations/home"
import { formatDateTime } from "/util/dataFormatFunctions"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

import {
  CourseStatus,
  NewCourseFieldsFragment,
  NewCoursesDocument,
} from "/graphql/generated"

const CardHeader = styled("div")`
  position: relative;
  background-color: #ffad14;
  height: 52px;
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  overflow: hidden;
`

const CardActions = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const CourseDate = (props: TypographyProps) => (
  <Typography variant="subtitle2" {...props} />
)

// @ts-ignore: not used for now
const CourseCard = ({
  name,
  description,
  start_date,
  end_date,
}: NewCourseFieldsFragment) => {
  const date =
    start_date && end_date
      ? `${formatDateTime(start_date)} - ${formatDateTime(end_date)}`
      : "Jatkuva kurssi"

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle variant="h4">{name}</CardTitle>
        <CardHeaderImage
          alt="MOOC logo"
          src={moocLogo}
          width={200}
          height={200}
        />
      </CardHeader>
      <CardBody>
        <CardDescription>{description}</CardDescription>
        <CardActions>
          <CourseDate>{date}</CourseDate>
          <Button>Kurssin tiedot</Button>
        </CardActions>
      </CardBody>
    </CardWrapper>
  )
}

export const CoursesGrid = styled("div")(
  ({ theme }) => `
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  width: 100%;
  margin-bottom: 2rem;

  ${theme.breakpoints.down("sm")} {
    padding: 0;
    width: 100%;
    grid-template-columns: 1fr;
  }
`,
)

function SelectedCourses() {
  const { locale = "fi" } = useRouter()
  const t = useTranslator(HomeTranslations)
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading, data } = useQuery(NewCoursesDocument, {
    variables: { language },
    ssr: false,
  })

  const notEndedCourses =
    data?.courses?.filter((course) => course.status !== CourseStatus.Ended) ??
    []
  return (
    <section id="courses">
      <Introduction title={t("popularCoursesTitle")} />
      <ContentWrapper>
        <CoursesGrid>
          {loading
            ? range(0, 4).map((index) => (
                <CourseCardSkeleton key={`skeleton-${index}`} />
              ))
            : sample(notEndedCourses, 4).map((course) => (
                <CommonCourseCard key={course.id} course={course} />
              ))}
        </CoursesGrid>
        <CTAButton href="/_new/courses">{t("showAllCourses")}</CTAButton>
      </ContentWrapper>
    </section>
  )
}

export default SelectedCourses
