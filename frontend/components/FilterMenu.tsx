import { useCallback, useState } from "react"

import { Clear, Search } from "@mui/icons-material"
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { useSearch } from "/hooks/useSearch"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

import {
  CourseCoreFieldsFragment,
  CourseStatus,
  EditorCoursesQueryVariables,
} from "/graphql/generated"

const Container = styled("div")`
  background-color: white;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  min-width: 300px;
`

const Row = styled("section")`
  display: grid;
  grid-gap: 0.5rem;
  margin: 0.5rem;
  @media (max-width: 460px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "hidden"
      "status"
      "handled-by";
  }
  @media (min-width: 460px) and (max-width: 810px) {
    grid-template-columns: 1fr 2fr;
    grid-template-areas:
      "hidden status"
      "handled-by handled-by";
  }
  @media (min-width: 810px) {
    grid-template-columns: repeat(5, 1fr);
    grid-template-areas: "hidden status status handled-by handled-by";
  }
`

const SearchTextField = styled(TextField)`
  grid-column: span 6;
`

const HiddenFormControl = styled(FormControl)`
  grid-area: hidden;
`

const StatusFormControl = styled(FormControl)`
  grid-area: status;
`

const HandledByFormControl = styled(FormControl)`
  grid-area: handled-by;
`

const ActionRow = styled(Row)`
  display: flex;
  flex-direction: row-reverse;
`

const MarginButton = styled(Button)`
  margin-left: 0.5rem;
`

const StatusContainer = styled("div")`
  display: flex;
`

interface FilterFields {
  hidden: boolean
  status: boolean
  handler: boolean
}
interface FilterProps {
  searchVariables: EditorCoursesQueryVariables
  setSearchVariables: React.Dispatch<EditorCoursesQueryVariables>
  handlerCourses?: CourseCoreFieldsFragment[]
  status?: string[]
  setStatus?: React.Dispatch<React.SetStateAction<CourseStatus[]>>
  loading: boolean
  fields?: FilterFields
  label?: string
}

function FilterMenu({
  searchVariables,
  setSearchVariables,
  loading,
  handlerCourses = [],
  status = [],
  setStatus = () => void 0,
  fields,
  label,
}: FilterProps) {
  const t = useTranslator(CommonTranslations)
  const {
    hidden: showHidden = true,
    status: showStatus = true,
    handler: showHandler = true,
  } = fields ?? {}
  const {
    search: initialSearch,
    hidden: initialHidden,
    handledBy: initialHandledBy,
  } = searchVariables

  const { search, setSearch } = useSearch({ search: initialSearch ?? "" })
  const [hidden, setHidden] = useState(
    initialHidden === null ? true : initialHidden,
  )
  const [handledBy, setHandledBy] = useState(initialHandledBy ?? "")

  /*const inputLabel = useRef<any>(null)
  const [labelWidth, setLabelWidth] = useState(0)

  useEffect(() => setLabelWidth(inputLabel?.current?.offsetWidth ?? 0), [])*/

  const onSubmit = useCallback(() => {
    setSearchVariables({
      ...searchVariables,
      search,
      hidden,
      handledBy,
    })
  }, [searchVariables, search, hidden, handledBy])

  const handleStatusChange = useCallback(
    (value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStatus = (
        e.target.checked
          ? [...(searchVariables?.status ?? []), value]
          : (searchVariables?.status as CourseStatus[])?.filter(
              (v) => v !== value,
            ) ?? []
      ) as CourseStatus[]

      setStatus(newStatus)
      setSearchVariables({
        ...searchVariables,
        status: newStatus,
      })
    },
    [searchVariables],
  )

  const handleHiddenChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHidden(e.target.checked)
      setSearchVariables({
        ...searchVariables,
        hidden: e.target.checked,
      })
    },
    [searchVariables],
  )

  const handleHandledByChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      setHandledBy(e.target.value)
      setSearchVariables({
        ...searchVariables,
        handledBy: e.target.value,
      })
    },
    [searchVariables],
  )

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
    },
    [],
  )
  const onSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSubmit()
      }
    },
    [],
  )
  const onSearchReset = useCallback(() => {
    setSearch("")
  }, [])
  const onFormReset = useCallback(() => {
    setHidden(true)
    setHandledBy("")
    setStatus([CourseStatus.Active, CourseStatus.Upcoming])
    setSearchVariables({
      search: "",
      hidden: true,
      handledBy: null,
      status: [CourseStatus.Active, CourseStatus.Upcoming],
    })
  }, [])

  return (
    <Container>
      <Row>
        <SearchTextField
          id="searchString"
          label={label ?? t("search")}
          value={search}
          autoComplete="off"
          variant="outlined"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={onSearchReset}
                  disabled={search === ""}
                  edge="end"
                  aria-label="clear search"
                  size="large"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Row>
      {showHidden || showHandler || showStatus ? (
        <Row>
          {showHidden ? (
            <HiddenFormControl disabled={loading}>
              <FormControlLabel
                label={t("showHidden")}
                control={
                  <Checkbox
                    id="hidden"
                    checked={hidden}
                    onChange={handleHiddenChange}
                  />
                }
              />
            </HiddenFormControl>
          ) : null}
          {showStatus ? (
            <StatusFormControl disabled={loading}>
              <StatusContainer>
                {["Active", "Upcoming", "Ended"].map((value) => (
                  <FormControlLabel
                    label={t(value as any)}
                    key={value}
                    control={
                      <Checkbox
                        id={value}
                        checked={status.includes(value)}
                        onChange={handleStatusChange(value)}
                      />
                    }
                  />
                ))}
              </StatusContainer>
            </StatusFormControl>
          ) : null}
          {showHandler ? (
            <HandledByFormControl disabled={loading}>
              <Select
                value={loading ? "" : handledBy}
                variant="outlined"
                onChange={handleHandledByChange}
                label={t("handledBy")}
                input={
                  <OutlinedInput
                    notched={Boolean(handledBy)}
                    name="handledBy"
                    id="handledBy"
                  />
                }
              >
                <MenuItem value="" key="handleempty">
                  &nbsp;
                </MenuItem>
                {handlerCourses?.map((course) => (
                  <MenuItem key={`handled-${course.id}`} value={course.slug}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </HandledByFormControl>
          ) : null}
        </Row>
      ) : null}
      <ActionRow>
        <MarginButton
          disabled={loading}
          onClick={onSubmit}
          color="primary"
          variant="contained"
          startIcon={<Search />}
        >
          {t("search")}
        </MarginButton>
        <Button
          disabled={loading}
          color="secondary"
          variant="contained"
          onClick={onFormReset}
        >
          {t("reset")}
        </Button>
      </ActionRow>
    </Container>
  )
}

export default FilterMenu
