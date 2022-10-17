import { useMemo, useState } from "react"

import styled from "@emotion/styled"
import { Clear, Search } from "@mui/icons-material"
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material"

import { useFilterContext } from "/contexts/FilterContext"
import { useSearch } from "/hooks/useSearch"
import CommonTranslations from "/translations/common"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"

import { CourseStatus } from "/graphql/generated"

const Container = styled.div`
  background-color: white;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  min-width: 300px;
`

const Row = styled.section`
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

  const onSubmit = () => {
    setSearchVariables({
      ...searchVariables,
      search,
      hidden,
      handledBy,
    })
  }

  const handleStatusChange =
    (value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStatus = (
        e.target.checked
          ? [...(searchVariables?.status ?? []), value]
          : (searchVariables?.status as CourseStatus[])?.filter(
              (v) => v !== value,
            ) ?? []
      ) as CourseStatus[]

      setSearchVariables({
        ...searchVariables,
        status: newStatus,
      })
    }

  const handleHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHidden(e.target.checked)
    setSearchVariables({
      ...searchVariables,
      hidden: e.target.checked,
    })
  }

  const handleHandledByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandledBy(e.target.value)
    setSearchVariables({
      ...searchVariables,
      handledBy: e.target.value,
    })
  }

  return (
    <Container>
      <Row>
        <TextField
          id="searchString"
          label={label ?? t("search")}
          value={search}
          autoComplete="off"
          variant="outlined"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearch("")
                  }}
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
          style={{ gridColumn: "span 6" }}
        />
      </Row>
      {(showHidden || showHandler || showStatus) && (
        <Row>
          {showHidden && (
            <FormControl disabled={loading} style={{ gridArea: "hidden" }}>
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
            </FormControl>
          )}
          {showStatus && (
            <FormControl disabled={loading} style={{ gridArea: "status" }}>
              <div style={{ display: "flex" }}>
                {["Active", "Upcoming", "Ended"].map((value) => (
                  <FormControlLabel
                    label={t(value as any)}
                    key={value}
                    control={
                      <Checkbox
                        id={value}
                        checked={searchVariables?.status?.includes(
                          value as CourseStatus,
                        )}
                        onChange={handleStatusChange(value)}
                      />
                    }
                  />
                ))}
              </div>
            </FormControl>
          )}
          {showHandler && (
            <FormControl disabled={loading} style={{ gridArea: "handled-by" }}>
              <TextField
                id="handledBy"
                select
                value={handledBy}
                onChange={handleHandledByChange}
                label={t("handledBy")}
                variant="outlined"
              >
                <MenuItem value="" key="handleempty">
                  &nbsp;
                </MenuItem>
                {handlerCourses?.map((course) => (
                  <MenuItem key={`handled-${course.id}`} value={course.slug}>
                    {course.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          )}
        </Row>
      )}
      <Row style={{ display: "flex", flexDirection: "row-reverse" }}>
        <Button
          disabled={loading}
          onClick={onSubmit}
          color="primary"
          variant="contained"
          style={{ marginLeft: "0.5rem" }}
          startIcon={<Search />}
        >
          {t("search")}
        </Button>
        <Button
          disabled={loading}
          color="secondary"
          variant="contained"
          onClick={() => {
            setHidden(true)
            setHandledBy("")
            setSearchVariables({
              search: "",
              hidden: true,
              handledBy: null,
              status: [CourseStatus.Active, CourseStatus.Upcoming],
            })
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          {t("reset")}
        </Button>
      </Row>
    </Container>
  )
}
