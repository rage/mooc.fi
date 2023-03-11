import { PropsWithChildren, useCallback, useMemo, useState } from "react"

import { useRouter } from "next/router"

import {
  Card,
  CardContent,
  CardProps,
  Collapse,
  Paper,
  Skeleton,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import InfoRow from "../../InfoRow"
import { LinkIconComponent, Spacer } from "../common"
import CollapseButton from "/components/Buttons/CollapseButton"
import ClipboardButton from "/components/ClipboardButton"
import { CardTitle } from "/components/Text/headers"
import { useLoginStateContext } from "/contexts/LoginStateContext"

import { UserCourseSummaryCourseFieldsFragment } from "/graphql/generated"

export const CourseEntryCardBase = styled((props: CardProps) => (
  <Card elevation={4} {...props} />
))`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 100%;
`

export const CourseEntryCardTitleWrapper = styled("div")`
  margin: 0 1rem;
  display: flex;
  flex-direction: row;
`
export const CourseEntryCardTitle = styled(CardTitle)``

export const CourseInfo = styled("div")`
  display: flex;
  flex-direction: column;
`

export const CourseEntryPartSkeleton = () => (
  <Paper component="div" style={{ padding: "0.5rem", marginBottom: "1rem" }}>
    <Skeleton />
  </Paper>
)

interface CourseEntryCardProps {
  course: UserCourseSummaryCourseFieldsFragment
  hasCopyButton?: boolean
}

export const CourseEntryCard = ({
  course,
  hasCopyButton,
  children,
}: PropsWithChildren<CourseEntryCardProps>) => {
  const router = useRouter()
  const { admin } = useLoginStateContext()
  const [courseInfoOpen, setCourseInfoOpen] = useState(false)
  const onCollapseCourseInfoClick = useCallback(
    () => setCourseInfoOpen((value) => !value),
    [],
  )
  const permanentURL = useMemo(() => {
    const basePath = router.asPath.split("?")[0].split("summary")[0]
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : ""
    return `${origin}${basePath}summary/${course.slug}/`
  }, [course, router])

  return (
    <CourseEntryCardBase>
      <CourseEntryCardTitleWrapper>
        <CourseEntryCardTitle variant="h3">{course.name}</CourseEntryCardTitle>
        {admin && (
          <CollapseButton
            open={courseInfoOpen}
            onClick={onCollapseCourseInfoClick}
            tooltip={"show more info"}
          />
        )}
        <Spacer />
        {hasCopyButton && (
          <ClipboardButton
            content={permanentURL}
            tooltipText="Copy permanent URL"
            disabled={!permanentURL}
            Icon={LinkIconComponent}
          />
        )}
      </CourseEntryCardTitleWrapper>
      {admin && (
        <Collapse in={courseInfoOpen} unmountOnExit>
          <CourseInfo>
            <InfoRow title="ID" content={course.id} copyable />
            <InfoRow title="Slug" content={course.slug} copyable />
          </CourseInfo>
        </Collapse>
      )}
      <CardContent>{children}</CardContent>
    </CourseEntryCardBase>
  )
}
