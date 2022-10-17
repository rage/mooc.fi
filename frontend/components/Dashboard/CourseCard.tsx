import { PropsWithChildren } from "react"

import Link from "next/link"

import styled from "@emotion/styled"
import { AddCircle as AddCircleIcon, Add as AddIcon } from "@mui/icons-material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import EditIcon from "@mui/icons-material/Edit"
import {
  BoxProps,
  CardActions,
  Skeleton,
  Typography,
  TypographyProps,
} from "@mui/material"

import CourseStatusBadge from "./CourseStatusBadge"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import CourseImage from "/components/CourseImage"
import { formatDate } from "/components/DataFormatFunctions"
import { CardTitle } from "/components/Text/headers"
import { useFilterContext } from "/contexts/FilterContext"
import CommonTranslations from "/translations/common"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

import { EditorCourseFieldsFragment } from "/graphql/generated"

const CardBase = styled.div<{ ishidden?: number }>`
  position: relative;
  box-shadow: 18px 7px 28px -12px rgba(0, 0, 0, 0.41);

  &:hover {
    box-shadow: 18px 7px 48px -12px rgba(0, 0, 0, 1);
    transition-duration: 0.4s;
  }

  background-color: ${(props) => (props.ishidden ? "#E0E0E0" : "#FFFFFF")};
  height: 100%;
  width: 100%;
  min-width: 340px;
  display: grid;
  @media (max-width: 700px) {
    grid-template-columns: repeat(1, 1fr);
  }
  @media (min-width: 700px) {
    grid-template-columns: repeat(3, 1fr);
  }
  flex-direction: row;
`

const ImageContainer = styled.div`
  height: 235px;
  @media (max-width: 430px) {
    width: 45%;
  }
  @media (min-width: 430px) and (max-width: 600px) {
    width: 40%;
  }
  @media (min-width: 600px) {
    width: 35%;
  }
  position: relative;
`

const StyledLink = styled.a`
  text-decoration: none;
  margin-left: 0px;
`
const CourseCardItem = styled.li`
  display: flex;
  padding: 1rem;
  height: 100%;
`

const CourseCardImageContainer = styled(ImageContainer)`
  padding: 1rem;
  width: 100%;
  min-width: 235px;
  @media (max-width: 430px) {
    height: 235px;
  }
  @media (min-width: 430px) and (max-width: 600px) {
    height: 235px;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    height: 240px;
  }
`

const CourseCardContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 1rem;
  padding-bottom: 0;
  grid-column: span 2;
`

const CourseCardActionArea = styled(CardActions)`
  justify-content: flex-end;
  display: flex;
  margin-top: auto;
`

const CourseInfoList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

const CourseInfoLine = styled.li`
  display: grid;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 600px) {
    grid-template-columns: 2fr 1fr;
  }
  flex-direction: row;
`

const NewCourseImageIconContainer = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
  border: 2px solid #e0e0e0;
`

const CourseTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CourseInfoField = ({
  variant = "h4",
  component = "h3",
  children,
  ...props
}: PropsWithChildren<TypographyProps & BoxProps>) => (
  <Typography
    {...props}
    variant={variant}
    component={component}
    style={{
      display: "block",
      marginRight: "0.5rem",
    }}
  >
    {children}
  </Typography>
)

const CourseInfoValue = styled.div`
  display: flex;
  justify-content: flex-end;
`

const CourseCardBase = styled(CardBase)`
  grid-column: span 1;
`
interface CourseInfoProps {
  field?: string | JSX.Element
  value?: string | JSX.Element
}
const CourseInfo = ({
  field,
  value,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement> &
  PropsWithChildren<CourseInfoProps>) => (
  <CourseInfoLine {...props}>
    {field && <CourseInfoField>{field}</CourseInfoField>}
    {value && <CourseInfoValue>{value}</CourseInfoValue>}
    {children}
  </CourseInfoLine>
)
interface CourseCardProps {
  course?: EditorCourseFieldsFragment
  loading?: boolean
}

const SkeletonCourseCard = () => {
  return (
    <CourseCardItem>
      <CourseCardBase>
        <CourseCardImageContainer>
          <Skeleton variant="rectangular" height="100%" />
        </CourseCardImageContainer>
        <CourseCardContent>
          <CardTitle variant="h3" component="h2" align="left">
            <Skeleton variant="text" />
          </CardTitle>
          <CourseInfoList>
            <CourseInfo>
              <Skeleton width="60%" />
            </CourseInfo>
            <CourseInfo>
              <Skeleton width="50%" />
            </CourseInfo>
            <CourseInfo>
              <Skeleton width="70%" />
            </CourseInfo>
          </CourseInfoList>
        </CourseCardContent>
        <CourseCardActionArea style={{ gridColumn: "span 3" }}>
          <Skeleton variant="rectangular" height="2rem" width="12%" />
          <Skeleton variant="rectangular" height="2rem" width="18%" />
          <Skeleton variant="rectangular" height="2rem" width="10%" />
        </CourseCardActionArea>
      </CourseCardBase>
    </CourseCardItem>
  )
}

const CourseCardImage = ({ course }: CourseCardProps) => {
  const t = useTranslator(CoursesTranslations, CommonTranslations)

  if (course) {
    return <CourseImage photo={course.photo} alt={course.name} />
  }

  return (
    <Link href={`/courses/new`} passHref>
      <StyledLink aria-label={t("createNewCourse")}>
        <NewCourseImageIconContainer>
          <AddCircleIcon fontSize="large" />
        </NewCourseImageIconContainer>
      </StyledLink>
    </Link>
  )
}

const CourseCard = ({ course, loading }: CourseCardProps) => {
  const t = useTranslator(CoursesTranslations, CommonTranslations)
  const { onStatusClick } = useFilterContext()

  if (loading) {
    return <SkeletonCourseCard />
  }

  return (
    <CourseCardItem key={`course-card-${course?.id ?? "new"}`}>
      <CourseCardBase ishidden={course?.hidden ? 1 : undefined}>
        <CourseCardImageContainer>
          <CourseCardImage course={course} loading={loading} />
        </CourseCardImageContainer>
        <CourseCardContent>
          <CardTitle variant="h3" component="h2" align="left">
            {course ? (
              <CourseTitleContainer>
                {course.name}
                <CourseStatusBadge
                  status={course?.status ? t(course.status) : ""}
                  clickable={Boolean(onStatusClick)}
                  onClick={onStatusClick?.(course?.status)}
                />
              </CourseTitleContainer>
            ) : (
              t("courseNewCourse")
            )}
          </CardTitle>
          {course && (
            <CourseInfoList>
              <CourseInfo style={{ marginBottom: "1rem" }}>
                {formatDate(course?.start_date)} {t("to")}{" "}
                {course?.end_date ? formatDate(course?.end_date) : t("ongoing")}
              </CourseInfo>

              <CourseInfo
                field={t("teacherInCharge")}
                value={course?.teacher_in_charge_name ?? "-"}
              />
              <CourseInfo
                field={t("teacherInChargeEmail")}
                value={course?.teacher_in_charge_email ?? "-"}
              />
              <CourseInfo
                field={t("supportEmail")}
                value={course?.support_email ?? "-"}
              />
              <CourseInfo field={t("slug")} value={course?.slug ?? "-"} />
            </CourseInfoList>
          )}
          <CourseCardActionArea>
            {course ? (
              <>
                <Link href={`/courses/${course.slug}`} passHref>
                  <StyledLink
                    aria-label={t("toCourseHomePage", { name: course.name })}
                  >
                    <StyledButton variant="text" startIcon={<DashboardIcon />}>
                      {t("dashboard")}
                    </StyledButton>
                  </StyledLink>
                </Link>
                <Link href={`/courses/new?clone=${course.slug}`} passHref>
                  <StyledLink
                    aria-label={t("cloneCourse", { name: course.name })}
                  >
                    <StyledButton
                      variant="text"
                      color="secondary"
                      startIcon={<AddIcon />}
                    >
                      {t("clone")}
                    </StyledButton>
                  </StyledLink>
                </Link>
                <Link
                  href={`/courses/${course.slug}/edit`}
                  passHref
                  prefetch={false}
                >
                  <StyledLink
                    aria-label={t("editCourseWithName", { name: course.name })}
                  >
                    <StyledButton variant="text" startIcon={<EditIcon />}>
                      {t("edit")}
                    </StyledButton>
                  </StyledLink>
                </Link>
              </>
            ) : (
              <Link href={`/courses/new`} passHref>
                <StyledLink aria-label={t("createNewCourse")}>
                  <StyledButton variant="text" color="secondary">
                    <AddIcon />
                    {t("create")}
                  </StyledButton>
                </StyledLink>
              </Link>
            )}
          </CourseCardActionArea>
        </CourseCardContent>
      </CourseCardBase>
    </CourseCardItem>
  )
}

export default CourseCard
