import ReverseOrderIcon from "@fortawesome/fontawesome-free/svgs/solid/arrow-down-wide-short.svg?icon"
import OrderIcon from "@fortawesome/fontawesome-free/svgs/solid/arrow-up-short-wide.svg?icon"
import {
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Skeleton,
  TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import {
  useUserPointsSummaryContext,
  useUserPointsSummaryFunctionsContext,
} from "./contexts"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import { UserCourseSummaryCourseFieldsFragment } from "/graphql/generated"

const Container = styled("div")(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  width: 30vw;

  ${theme.breakpoints.down("lg")} {
    flex-direction: row;
    width: 100%;
    align-items: flex-start;
    border: 1px solid ${theme.palette.divider};
  }
`,
)

const CourseSelectListItemTextNested = styled("span")`
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
  &:first-of-type:after {
    top: calc((1.5rem / -2) + 0.5rem);
    height: 2rem;
  }
  &:last-of-type:after {
    height: 0.5rem;
  }
`

const CourseSelectListItemText = styled(ListItemText)`
  &:last-child {
    border-color: transparent;
  }
`

const CourseSelectListBase = styled(List)(
  ({ theme }) => `
  ${theme.breakpoints.down("lg")} {
    width: 100%;
  }
`,
) as typeof List

const ListToolbar = styled("div")(
  ({ theme }) => `
  display: flex;
  flex-direction: row;
  padding: 0.5rem;

  ${theme.breakpoints.down("lg")} {
    width: 40%;
  }
`,
)

const CourseSelectList = () => {
  const t = useTranslator(ProfileTranslations)
  const { data, sort, order, sortOptions, loading, selected } =
    useUserPointsSummaryContext()
  const { setSelected, onCourseSortChange, onSortOrderToggle } =
    useUserPointsSummaryFunctionsContext()
  const handleListItemClick = useEventCallback(
    (slug: UserCourseSummaryCourseFieldsFragment["slug"]) => () =>
      setSelected(slug),
  )

  return (
    <Container>
      <ListToolbar>
        <TextField
          select
          variant="outlined"
          value={sort}
          label={t("courseSortOrder")}
          onChange={onCourseSortChange}
          size="small"
          disabled={!loading && data?.length === 0}
        >
          {sortOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              <small>{o.label}</small>
            </MenuItem>
          ))}
        </TextField>
        <IconButton
          onClick={onSortOrderToggle}
          title={order === "asc" ? t("orderAscending") : t("orderDescending")}
          disabled={!loading && data?.length === 0}
        >
          {order === "desc" ? (
            <ReverseOrderIcon fontSize="small" />
          ) : (
            <OrderIcon fontSize="small" />
          )}
        </IconButton>
      </ListToolbar>
      <CourseSelectListBase component="nav">
        {loading && (
          <>
            <CourseSelectListItemSkeleton />
            <CourseSelectListItemSkeleton />
            <CourseSelectListItemSkeleton />
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
              primary={course.name}
              primaryTypographyProps={{
                variant: "subtitle2",
              }}
              secondary={tier_summaries?.map(({ course: tierCourse }) => (
                <CourseSelectListItemTextNested key={tierCourse.id}>
                  {tierCourse.name}
                </CourseSelectListItemTextNested>
              ))}
            />
          </ListItemButton>
        ))}
      </CourseSelectListBase>
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
