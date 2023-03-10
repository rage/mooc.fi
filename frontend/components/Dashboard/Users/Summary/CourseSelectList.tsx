import { useCallback } from "react"

import { ListItemText, Skeleton, Typography } from "@mui/material"
import { List, ListItemButton } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useUserPointsSummaryContext } from "./UserPointsSummaryContext"
import { useUserPointsSummarySelectedCourseContext } from "./UserPointsSummarySelectedCourseContext"

import { UserCourseSummaryCourseFieldsFragment } from "/graphql/generated"

interface CourseSelectListProps {
  loading?: boolean
  selected?: UserCourseSummaryCourseFieldsFragment["slug"]
}

const Container = styled("div")`
  width: 30vw;
`

const CourseSelectListItemTextNested = styled("div")`
  display: block;
  position: relative;
  padding-left: calc(2 * 1.5rem - 2px);

  &:before {
    content: "";
    display: block;
    position: absolute;
    top: calc(1.5rem / -2 + 0.5rem);
    left: 0.5rem;
    width: calc(1.5rem + 2px);
    height: calc(1.5rem - 8px);
    border: solid #ddd;
    border-width: 0 0 2px 2px;
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0.5rem;
    top: calc(1.5rem / -2);
    left: 0.5rem;
    width: calc(1.5rem + 2px);
    height: 2.5rem;
    border-left: solid 2px #ddd;
  }
  &:first-child:after {
    top: calc((1.5rem / -2) + 0.5rem);
    height: 2rem;
  }
  &:last-child:after {
    height: 0.5rem;
  }
`
const CourseSelectListItemText = styled(ListItemText)`
  &:last-child {
    border-color: transparent;
  }
`
/*
 */
const CourseSelectList = ({ selected, loading }: CourseSelectListProps) => {
  const data = useUserPointsSummaryContext()
  const { setSelected } = useUserPointsSummarySelectedCourseContext()

  const handleListItemClick = useCallback(
    (slug: UserCourseSummaryCourseFieldsFragment["slug"]) => () => {
      setSelected(slug)
    },
    [setSelected],
  )

  return (
    <Container>
      <List component="nav">
        {loading && (
          <>
            <CourseSelectListItemSkeleton />
            <CourseSelectListItemSkeleton />
            <CourseSelectListItemSkeleton />
          </>
        )}
        {data?.map(({ course, tier_summaries }) => (
          <ListItemButton
            key={course.id}
            selected={selected === course.slug}
            onClick={handleListItemClick(course.slug)}
          >
            <CourseSelectListItemText
              primary={
                <Typography variant="subtitle2" component="span">
                  {course.name}
                </Typography>
              }
              secondary={
                tier_summaries
                  ? tier_summaries.map(({ course: tierCourse }) => (
                      <CourseSelectListItemTextNested key={tierCourse.id}>
                        {tierCourse.name}
                      </CourseSelectListItemTextNested>
                    ))
                  : null
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Container>
  )
}

export function CourseSelectListItemSkeleton() {
  return (
    <ListItemButton>
      <ListItemText primary={<Skeleton />} />
    </ListItemButton>
  )
}

export default CourseSelectList
