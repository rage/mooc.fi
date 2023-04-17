import { PropsWithChildren } from "react"

import { AddCircle as AddCircleIcon, Add as AddIcon } from "@mui/icons-material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import EditIcon from "@mui/icons-material/Edit"
import {
  BoxProps,
  CardActions,
  Link,
  Skeleton,
  Typography,
  TypographyProps,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import CourseStatusBadge from "./CourseStatusBadge"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import CourseImage from "/components/CourseImage"
import { CardTitle } from "/components/Text/headers"
import { formatDateTime } from "/util/dataFormatFunctions"

import { CourseStatus, EditorCourseFieldsFragment } from "/graphql/generated"

const CardBase = styled("div", {
  shouldForwardProp: (prop) => prop !== "isHidden",
})<{ isHidden?: number }>`
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
`

const CourseCardActionArea = styled(CardActions)`
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
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 600px) {
    grid-template-columns: 2fr 1fr;
  }
  flex-direction: row;
`

const CourseInfoField = styled(
  ({
    variant = "h4",
    component = "h3",
    children,
    ...props
  }: PropsWithChildren<TypographyProps & BoxProps>) => (
    <Typography variant={variant} component={component} {...props}>
      {children}
    </Typography>
  ),
)`
  display: block;
  margin-right: 0.5rem;
`

const CourseInfoValue = styled("div")`
  display: flex;
  justify-content: flex-end;
`

const CreateCourseIconContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border: 1px solid #e0e0e0;
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
  onClickStatus?: (value: CourseStatus | null) => (_: any) => void
}

const CourseCard = ({ course, loading, onClickStatus }: CourseCardProps) => {
  const courseFound = !loading && !!course
  const courseNotFound = !course && !loading

  return (
    <CourseCardItem key={course?.id ?? "new-course"}>
      <CardBase
        style={{ gridColumn: "span 1" }}
        isHidden={course?.hidden ? 1 : undefined}
      >
        <CourseCardImageContainer>
          {loading && <Skeleton variant="rectangular" height="100%" />}
          {courseFound && (
            <CourseImage photo={course.photo} alt={course.name} />
          )}
          {courseNotFound && (
            <StyledLink href={`/courses/new`} aria-label={`Create new course`}>
              <CreateCourseIconContainer>
                <AddCircleIcon fontSize="large" />
              </CreateCourseIconContainer>
            </StyledLink>
          )}
        </CourseCardImageContainer>
        <CourseCardContent style={{ gridColumn: "span 2" }}>
          <CardTitle variant="h3" component="h2" align="left">
            {loading && <Skeleton variant="text" />}
            {courseFound && (
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
            )}
            {courseNotFound && "New Course"}
          </CardTitle>
          {course && (
            <CourseInfoList>
              <CourseInfo style={{ marginBottom: "1rem" }}>
                {formatDateTime(course?.start_date)} to{" "}
                {formatDateTime(course?.end_date ?? "")}
              </CourseInfo>

              <CourseInfo
                field="Teacher in charge:"
                value={course?.teacher_in_charge_name ?? "-"}
              />
              <CourseInfo
                field="Teacher in charge email:"
                value={course?.teacher_in_charge_email ?? "-"}
              />
              <CourseInfo
                field="Support email:"
                value={course?.support_email ?? "-"}
              />
              <CourseInfo field="Slug:" value={course?.slug ?? "-"} />
            </CourseInfoList>
          )}
          <CourseCardActionArea>
            {loading && <Skeleton variant="rectangular" width="100%" />}
            {courseFound && (
              <>
                <StyledButton
                  href={`/courses/${course.slug}`}
                  aria-label={`To the homepage of course ${course.name}`}
                  variant="text"
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </StyledButton>
                <StyledButton
                  href={`/courses/new?clone=${course.slug}`}
                  aria-label={`Clone course ${course.name}`}
                  variant="text"
                  color="secondary"
                  startIcon={<AddIcon />}
                >
                  Clone...
                </StyledButton>
                <StyledButton
                  href={`/courses/${course.slug}/edit`}
                  prefetch={false}
                  aria-label={`Edit course ${course.name}`}
                  variant="text"
                  startIcon={<EditIcon />}
                >
                  Edit
                </StyledButton>
              </>
            )}
            {courseNotFound && (
              <StyledButton
                href={`/courses/new`}
                aria-label="Create new course"
                variant="text"
                color="secondary"
              >
                <AddIcon />
                Create
              </StyledButton>
            )}
          </CourseCardActionArea>
        </CourseCardContent>
      </CardBase>
    </CourseCardItem>
  )
}

export default CourseCard
