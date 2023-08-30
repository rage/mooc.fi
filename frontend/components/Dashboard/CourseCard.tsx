import { PropsWithChildren } from "react"

import { AddCircle as AddCircleIcon, Add as AddIcon } from "@mui/icons-material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import EditIcon from "@mui/icons-material/Edit"
import { CardActions, Link, Skeleton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import CourseStatusBadge from "./CourseStatusBadge"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import CourseImage from "/components/CourseImage"
import { CardTitle } from "/components/Text/headers"
import { useFilterContext } from "/contexts/FilterContext"
import useIsNew from "/hooks/useIsNew"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"
import { formatDateTime } from "/util/dataFormatFunctions"

import { EditorCourseFieldsFragment } from "/graphql/generated"

const CardBase = styled("div", {
  shouldForwardProp: (prop) => prop !== "isHidden",
})<{ isHidden?: boolean | null }>`
  position: relative;
  box-shadow: 18px 7px 28px -12px rgba(0, 0, 0, 0.41);

  &:hover {
    box-shadow: 18px 7px 48px -12px rgba(0, 0, 0, 1);
    transition-duration: 0.4s;
  }

  background-color: ${(props) => (props.isHidden ? "#E0E0E0" : "#FFFFFF")};
  height: 100%;
  width: 100%;
  min-width: 340px;
  display: grid;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  flex-direction: row;
`

const ImageContainer = styled("div")`
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

const StyledLink = styled(Link)`
  text-decoration: none;
  margin-left: 0px;
` as typeof Link

const CourseCardItem = styled("li")`
  display: flex;
  padding: 1rem;
  height: 100%;
`

const CourseCardImageContainer = styled(ImageContainer)`
  padding: 1rem;
  width: 100%;
  min-width: 235px;
  position: relative;
  height: 100%;
  @media (max-width: 430px) {
    min-height: 235px;
    grid-column: span 2 / auto;
  }
  @media (min-width: 430px) and (max-width: 768px) {
    min-height: 235px;
    width: 100%;
    grid-column: span 2 / auto;
  }
  @media (min-width: 768px) and (max-width: 960px) {
    min-height: 240px;
  }
`

const CourseCardContent = styled("div")`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 1rem;
  padding-bottom: 0;
  grid-column: span 2;
`

const CourseCardActions = styled(CardActions)`
  justify-content: flex-end;
  display: flex;
  margin-top: auto;
`

const CourseInfoList = styled("ul")`
  list-style: none;
  margin: 0;
  padding: 0;
`
const CourseInfoLine = styled("li")`
  display: grid;
  align-items: baseline;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 600px) {
    grid-template-columns: 2fr 1fr;
  }
  flex-direction: row;
`

const CourseCardBase = styled(CardBase)`
  grid-column: span 1;
`

const CourseInfoField = styled(Typography)`
  display: block;
  margin-right: 0.5rem;
` as typeof Typography

const CourseTitleBadgeContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CourseInfoValue = styled(Typography)`
  display: flex;
  justify-content: flex-end;
` as typeof Typography

const CreateCourseIconContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border: 1px solid #e0e0e0;
`

interface CourseInfoProps {
  field?: string | React.JSX.Element
  value?: string | React.JSX.Element
}
const CourseInfo = ({
  field,
  value,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement> &
  PropsWithChildren<CourseInfoProps>) => (
  <CourseInfoLine {...props}>
    {field && <CourseInfoField variant="subtitle2">{field}</CourseInfoField>}
    {value && <CourseInfoValue variant="body2">{value}</CourseInfoValue>}
    {children}
  </CourseInfoLine>
)
interface CourseCardProps {
  course?: EditorCourseFieldsFragment
  isNew?: boolean
  loading?: boolean
}

const CourseCard = ({ course, loading, isNew }: CourseCardProps) => {
  const t = useTranslator(CoursesTranslations)
  const isNewLayout = useIsNew()
  const baseUrl = isNewLayout ? "/_new/admin" : ""

  const { onStatusClick } = useFilterContext()
  const courseFound = !loading && !!course

  return (
    <CourseCardItem key={isNew ? "new-course" : course?.id}>
      <CourseCardBase isHidden={course?.hidden}>
        <CourseCardImageContainer>
          {loading && <Skeleton variant="rectangular" height="100%" />}
          {courseFound && (
            <CourseImage photo={course.photo} alt={course.name} />
          )}
          {isNew && (
            <StyledLink
              href={`${baseUrl}/courses/new`}
              aria-label={t("courseNewCourse")}
            >
              <CreateCourseIconContainer>
                <AddCircleIcon fontSize="large" />
              </CreateCourseIconContainer>
            </StyledLink>
          )}
        </CourseCardImageContainer>
        <CourseCardContent>
          <CardTitle variant="h3" component="h2" align="left">
            {loading && <Skeleton variant="text" />}
            {courseFound && (
              <CourseTitleBadgeContainer>
                {course.name}
                <CourseStatusBadge
                  status={course?.status}
                  clickable={Boolean(onStatusClick)}
                  onClick={onStatusClick?.(course?.status)}
                />
              </CourseTitleBadgeContainer>
            )}
            {isNew && t("courseNewCourse")}
          </CardTitle>
          {course && (
            <CourseInfoList>
              <CourseInfo style={{ marginBottom: "1rem" }}>
                {formatDateTime(course?.start_date)} to{" "}
                {formatDateTime(course?.end_date)}
              </CourseInfo>

              <CourseInfo
                field={t("courseTeacherInChargeName")}
                value={course?.teacher_in_charge_name ?? "-"}
              />
              <CourseInfo
                field={t("courseTeacherInChargeEmail")}
                value={course?.teacher_in_charge_email ?? "-"}
              />
              <CourseInfo
                field={t("courseSupportEmail")}
                value={course?.support_email ?? "-"}
              />
              <CourseInfo field={t("courseSlug")} value={course?.slug ?? "-"} />
            </CourseInfoList>
          )}
          <CourseCardActions>
            {loading && <Skeleton variant="rectangular" width="100%" />}
            {courseFound && (
              <>
                <StyledButton
                  href={`${baseUrl}/courses/${course.slug}`}
                  prefetch={false}
                  aria-label={t("courseToCoursePage", { name: course.name })}
                  variant="text"
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </StyledButton>
                <StyledButton
                  href={`${baseUrl}/courses/new?clone=${course.slug}`}
                  prefetch={false}
                  aria-label={t("courseCloneCourse", { name: course.name })}
                  variant="text"
                  color="secondary"
                  startIcon={<AddIcon />}
                >
                  Clone...
                </StyledButton>
                <StyledButton
                  href={`${baseUrl}/courses/${course.slug}/edit`}
                  prefetch={false}
                  aria-label={t("courseEditCourse", { name: course.name })}
                  variant="text"
                  startIcon={<EditIcon />}
                >
                  Edit
                </StyledButton>
              </>
            )}
            {isNew && (
              <StyledButton
                prefetch={false}
                href={`${baseUrl}/courses/new`}
                aria-label={t("courseNewCourse")}
                variant="text"
                color="secondary"
              >
                <AddIcon />
                Create
              </StyledButton>
            )}
          </CourseCardActions>
        </CourseCardContent>
      </CourseCardBase>
    </CourseCardItem>
  )
}

export default CourseCard
