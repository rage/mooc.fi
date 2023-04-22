import { PropsWithChildren, useCallback, useMemo } from "react"

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
import { useCollapseContextCourse } from "../contexts"
import { ActionType, CollapsablePart } from "../contexts/CollapseContext"
import CollapseButton from "/components/Buttons/CollapseButton"
import ClipboardButton from "/components/ClipboardButton"
import { CardTitle } from "/components/Text/headers"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

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
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  background-color: #eee;
`

export const CourseEntryPartSkeleton = () => (
  <Paper component="div" style={{ padding: "0.5rem", marginBottom: "1rem" }}>
    <Skeleton />
  </Paper>
)

interface CourseEntryCardProps {
  course?: UserCourseSummaryCourseFieldsFragment | null
  hasCopyButton?: boolean
  hasCollapseButton?: boolean
}

const CourseEntryCardSkeleton = ({ children }: PropsWithChildren) => (
  <CourseEntryCardBase>
    <CourseEntryCardTitleWrapper>
      <CourseEntryCardTitle variant="h3">
        <Skeleton variant="text" width="200px" />
      </CourseEntryCardTitle>
    </CourseEntryCardTitleWrapper>
    <CardContent>{children}</CardContent>
  </CourseEntryCardBase>
)

export const CourseEntryCard = ({
  course,
  hasCopyButton,
  hasCollapseButton,
  children,
}: PropsWithChildren<CourseEntryCardProps>) => {
  const t = useTranslator(ProfileTranslations)
  const router = useRouter()
  const { admin } = useLoginStateContext()
  const { state, dispatch } = useCollapseContextCourse(course?.id ?? "_")

  const onCollapseCourseClick = useCallback(() => {
    if (!course) {
      return
    }
    dispatch({
      type: ActionType.TOGGLE,
      collapsable: CollapsablePart.COURSE,
      course: course?.id,
    })
  }, [course, dispatch])
  const permanentURL = useMemo(() => {
    if (!course) {
      return
    }
    const basePath = router.asPath.split("?")[0].split("summary")[0]
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : ""
    return `${origin}${basePath}summary/${course.slug}/`
  }, [course, router])

  if (!course) {
    return <CourseEntryCardSkeleton>{children}</CourseEntryCardSkeleton>
  }

  return (
    <CourseEntryCardBase>
      <CourseEntryCardTitleWrapper>
        <CourseEntryCardTitle variant="h3">{course.name}</CourseEntryCardTitle>
        <Spacer />
        {hasCopyButton && (
          <ClipboardButton
            data={permanentURL}
            tooltipText={t("copyCourseLink")}
            disabled={!permanentURL}
            Icon={LinkIconComponent}
          />
        )}
        {hasCollapseButton && (
          <CollapseButton
            open={state.open}
            onClick={onCollapseCourseClick}
            tooltip={t("showCourseDetails")}
          />
        )}
      </CourseEntryCardTitleWrapper>
      <Collapse in={state.open}>
        <CardContent>
          {admin && (
            <CourseInfo>
              <InfoRow
                title={t("moocfiId")}
                fullWidth
                data={course.id}
                variant="caption"
                copyable
              />
              <InfoRow
                title={t("slug")}
                fullWidth
                data={course.slug}
                variant="caption"
                copyable
              />
            </CourseInfo>
          )}

          {children}
        </CardContent>
      </Collapse>
    </CourseEntryCardBase>
  )
}
