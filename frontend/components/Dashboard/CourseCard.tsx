import { PropsWithChildren, memo } from "react"
import { CardActions, Typography, TypographyProps } from "@material-ui/core"
import DashboardIcon from "@material-ui/icons/Dashboard"
import EditIcon from "@material-ui/icons/Edit"
import { Add as AddIcon, AddCircle as AddCircleIcon } from "@material-ui/icons"
import CourseImage from "../CourseImage"
import { AllEditorCourses_courses } from "/static/types/generated/AllEditorCourses"
import styled from "styled-components"
import LangLink from "/components/LangLink"
import { CardTitle } from "/components/Text/headers"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import Skeleton from "@material-ui/lab/Skeleton"
import CourseStatusBadge from "./CourseStatusBadge"
import { CourseStatus } from "/static/types/generated/globalTypes"

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
  min-width: 235px;
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

const CourseInfoField = ({
  variant = "h4",
  children,
  ...props
}: PropsWithChildren<TypographyProps>) => (
  <Typography
    {...props}
    variant={variant}
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
const formatDate = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString() : "-"

interface CourseCardProps {
  course?: AllEditorCourses_courses
  loading?: boolean
  onClickStatus?: (value: CourseStatus | null) => (_: any) => void
}

const CourseCard = memo(
  ({ course, loading, onClickStatus }: CourseCardProps) => (
    <CourseCardItem key={`course-card-${course?.id ?? "new"}`}>
      <CardBase
        style={{ gridColumn: "span 1" }}
        ishidden={course?.hidden ? 1 : undefined}
      >
        <CourseCardImageContainer>
          {loading ? (
            <Skeleton variant="rect" height="100%" />
          ) : course ? (
            <CourseImage photo={course.photo} alt={course.name} />
          ) : (
            <LangLink href={`/courses/new`}>
              <a>
                <div
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    display: "flex",
                    border: "2px solid #E0E0E0",
                  }}
                >
                  <AddCircleIcon fontSize="large" />
                </div>
              </a>
            </LangLink>
          )}
        </CourseCardImageContainer>
        <CourseCardContent style={{ gridColumn: "span 2" }}>
          <CardTitle variant="h3" component="h2" align="left">
            {loading ? (
              <Skeleton variant="text" />
            ) : course ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {course.name}
                <CourseStatusBadge
                  status={course?.status}
                  clickable={Boolean(onClickStatus)}
                  onClick={
                    onClickStatus ? onClickStatus(course?.status) : undefined
                  }
                />
              </div>
            ) : (
              "New Course"
            )}
          </CardTitle>
          {course ? (
            <CourseInfoList>
              <CourseInfo style={{ marginBottom: "1rem" }}>
                {formatDate(course?.start_date)} to{" "}
                {formatDate(course?.end_date)}
              </CourseInfo>

              <CourseInfo
                field="Teacher in charge:"
                value={course?.teacher_in_charge_name || "-"}
              />
              <CourseInfo
                field="Teacher in charge email:"
                value={course?.teacher_in_charge_email || "-"}
              />
              <CourseInfo
                field="Support email:"
                value={course?.support_email || "-"}
              />
              <CourseInfo field="Slug:" value={course?.slug || "-"} />
            </CourseInfoList>
          ) : null}
          <CourseCardActionArea>
            {loading ? (
              <>
                <Skeleton variant="rect" width="100%" />
              </>
            ) : course ? (
              <>
                <LangLink as={`/courses/${course.slug}`} href="/courses/[id]">
                  <StyledLink
                    aria-label={`To the homepage of course ${course.name}`}
                  >
                    <StyledButton variant="text" startIcon={<DashboardIcon />}>
                      Dashboard
                    </StyledButton>
                  </StyledLink>
                </LangLink>
                <LangLink
                  href="/courses/[id]/edit"
                  as={`/courses/${course.slug}/edit`}
                  prefetch={false}
                >
                  <StyledLink>
                    <StyledButton variant="text" startIcon={<EditIcon />}>
                      Edit
                    </StyledButton>
                  </StyledLink>
                </LangLink>
              </>
            ) : (
              <LangLink href={`/courses/new`}>
                <StyledLink>
                  <StyledButton variant="text" color="secondary">
                    <AddIcon />
                    Create
                  </StyledButton>
                </StyledLink>
              </LangLink>
            )}
          </CourseCardActionArea>
        </CourseCardContent>
      </CardBase>
    </CourseCardItem>
  ),
)

export default CourseCard
