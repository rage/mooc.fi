import { useCallback, useMemo } from "react"

import { Clear, Search } from "@mui/icons-material"
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { useFilterContext } from "/contexts/FilterContext"
import { useSearch } from "/hooks/useSearch"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import notEmpty from "/util/notEmpty"

import { CourseStatus } from "/graphql/generated"

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
  fields?: FilterFields
  label?: string
}

export default function FilterMenu({ fields, label }: FilterProps) {
  const { searchVariables, setSearchVariables, handlerCoursesData, loading } =
    useFilterContext()

  const handlerCourses = useMemo(
    () => handlerCoursesData?.handlerCourses?.filter(notEmpty) ?? [],
    [handlerCoursesData],
  )

  const t = useTranslator(CommonTranslations)
  const {
    hidden: showHidden = true,
    status: showStatus = true,
    handler: showHandler = true,
  } = fields ?? {}
  const { search: initialSearch, hidden, handledBy, status } = searchVariables

  const { search, setSearch } = useSearch({ search: initialSearch ?? "" })

  /*const inputLabel = useRef<any>(null)
  const [labelWidth, setLabelWidth] = useState(0)

  useEffect(() => setLabelWidth(inputLabel?.current?.offsetWidth ?? 0), [])*/

  const onSubmit = useCallback(() => {
    setSearchVariables((previousSearchVariables) => ({
      ...previousSearchVariables,
      search,
    }))
  }, [search])

  const handleStatusChange = useCallback(
    (value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStatus = (
        e.target.checked
          ? [...(searchVariables?.status ?? []), value]
          : (searchVariables?.status as CourseStatus[])?.filter(
              (v) => v !== value,
            ) ?? []
      ) as CourseStatus[]

      setSearchVariables((previousSearchVariables) => ({
        ...previousSearchVariables,
        status: newStatus,
      }))
    },
    [searchVariables],
  )

  const handleHiddenChange = useEventCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchVariables((previousSearchVariables) => ({
        ...previousSearchVariables,
        hidden: e.target.checked,
      }))
    },
  )

  const handleHandledByChange = useEventCallback(
    (e: SelectChangeEvent<string>) => {
      setSearchVariables((previousSearchVariables) => ({
        ...previousSearchVariables,
        handledBy: e.target.value,
      }))
    },
  )

  const onSearchChange = useEventCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
    },
  )
  const onSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSubmit()
      }
    },
    [onSubmit],
  )
  const onSearchReset = useEventCallback(() => {
    setSearch("")
  })
  const onFormReset = useEventCallback(() => {
    setSearchVariables({
      search: "",
      hidden: true,
      handledBy: null,
      status: [CourseStatus.Active, CourseStatus.Upcoming],
    })
  })

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
                  title={t("reset")}
                  size="large"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Row>
      {(showHidden || showHandler || showStatus) && (
        <Row>
          {showHidden ? (
            <HiddenFormControl disabled={loading}>
              <FormControlLabel
                label={t("showHidden")}
                control={
                  <Checkbox
                    id="hidden"
                    checked={hidden || false}
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
                        checked={(status ?? []).includes(value as CourseStatus)}
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
                value={loading ? "" : handledBy ?? ""}
                variant="outlined"
                onChange={handleHandledByChange}
                label={t("handledBy")}
              >
                <MenuItem value="" key="handleempty">
                  &nbsp;
                </MenuItem>
                {handlerCourses?.map((course) => (
                  <MenuItem key={course.id} value={course.slug}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </HandledByFormControl>
          ) : null}
        </Row>
      )}
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
