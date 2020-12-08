import { memo } from "react"
import { Grid, CardActionArea } from "@material-ui/core"
import DashboardIcon from "@material-ui/icons/Dashboard"
import EditIcon from "@material-ui/icons/Edit"
import { Add as AddIcon, AddCircle as AddCircleIcon } from "@material-ui/icons"
import CourseImage from "../CourseImage"
import { AllEditorCourses_courses } from "/static/types/generated/AllEditorCourses"
import styled from "styled-components"
import LangLink from "/components/LangLink"
import { CardTitle } from "/components/Text/headers"
import { ClickableButtonBase } from "/components/Surfaces/ClickableCard"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import Skeleton from "@material-ui/lab/Skeleton"

const CardBase = styled(ClickableButtonBase)<{
  ishidden?: number | null
  component?: any
}>`
  background-color: ${(props) => (props.ishidden ? "#E0E0E0" : "#FFFFFF")};
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
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
interface CourseCardProps {
  course?: AllEditorCourses_courses
  loading?: boolean
}

const CourseCardItem = styled.li`
  display: flex;
  padding: 1rem;
  height: 100%;
`

const CourseCardImageContainer = styled(ImageContainer)`
  padding: 1rem;
  @media (max-width: 430px) {
    height: 235px;
    width: 30%;
  }
  @media (min-width: 430px) and (max-width: 600px) {
    width: 45%;
    height: 235px;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    width: 40%;
    height: 240px;
  }
`

const CourseCardContent = styled.div`
  display: block;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: top;
`

const CourseCardActionArea = styled(CardActionArea)`
  justify-content: flex-end;
  display: flex;
  margin-top: auto;
  width: 10%;
`

const CourseInfo = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`
const CourseInfoField = styled.li`
  display: flex;
  flex-direction: row;
`

const formatDate = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString() : "-"

const CourseCard = memo(({ course, loading }: CourseCardProps) => (
  <CourseCardItem>
    <CardBase component="div" ishidden={course?.hidden ? 1 : undefined}>
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
      <CourseCardContent>
        <CardTitle variant="h3" component="h2" align="left">
          {loading ? (
            <Skeleton variant="text" />
          ) : course ? (
            course.name
          ) : (
            "New Course"
          )}
        </CardTitle>
        {course ? (
          <CourseInfo>
            <CourseInfoField style={{ marginBottom: "1rem" }}>
              {formatDate(course?.start_date)} to {formatDate(course?.end_date)}
            </CourseInfoField>
            <CourseInfoField>
              <table>
                <tr>
                  <td>
                    <b>Teacher in charge:</b>
                  </td>
                  <td>{course?.teacher_in_charge_name || "-"}</td>
                </tr>
                <tr>
                  <td>
                    <b>Teacher in charge email:</b>
                  </td>
                  <td>{course?.teacher_in_charge_email || "-"}</td>
                </tr>
                <tr>
                  <td>
                    <b>Support email:</b>
                  </td>
                  <td>{course?.support_email || "-"}</td>
                </tr>
              </table>
            </CourseInfoField>
          </CourseInfo>
        ) : null}
      </CourseCardContent>
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
    </CardBase>
  </CourseCardItem>
))

export default CourseCard
