import { useState } from "react"

import { HandlerCourses_handlerCourses } from "/static/types/generated/HandlerCourses"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

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
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material"

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

interface SearchVariables {
  search?: string
  hidden?: boolean | null
  handledBy?: string | null
  status?: string[] | null
}

interface FilterFields {
  hidden: boolean
  status: boolean
  handler: boolean
}
interface FilterProps {
  searchVariables: SearchVariables
  setSearchVariables: React.Dispatch<SearchVariables>
  handlerCourses?: HandlerCourses_handlerCourses[]
  status?: string[]
  setStatus?: React.Dispatch<React.SetStateAction<string[]>>
  loading: boolean
  fields?: FilterFields
}

export default function FilterMenu({
  searchVariables,
  setSearchVariables,
  loading,
  handlerCourses = [],
  status = [],
  setStatus = () => {},
  fields,
}: FilterProps) {
  const t = useTranslator(CommonTranslations)
  const {
    hidden: showHidden = true,
    status: showStatus = true,
    handler: showHandler = true,
  } = fields || {}
  const {
    search: initialSearch,
    hidden: initialHidden,
    handledBy: initialHandledBy,
  } = searchVariables

  const [searchString, setSearchString] = useState<string>(initialSearch ?? "")
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
      search: searchString,
      hidden,
      handledBy,
    })
  }

  const handleStatusChange =
    (value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStatus = e.target.checked
        ? [...(searchVariables?.status || []), value]
        : searchVariables?.status?.filter((v) => v !== value) || []

      setStatus(newStatus)
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

  const handleHandledByChange = (e: SelectChangeEvent<string>) => {
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
          label={t("search")}
          value={searchString}
          autoComplete="off"
          variant="outlined"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchString(e.target.value)
          }
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearchString("")
                  }}
                  disabled={searchString === ""}
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
      {showHidden || showHandler || showStatus ? (
        <Row>
          {showHidden ? (
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
          ) : null}
          {showStatus ? (
            <FormControl disabled={loading} style={{ gridArea: "status" }}>
              <div style={{ display: "flex" }}>
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
              </div>
            </FormControl>
          ) : null}
          {showHandler ? (
            <FormControl disabled={loading} style={{ gridArea: "handled-by" }}>
              <Select
                value={loading ? "" : handledBy}
                variant="outlined"
                label={t("handledBy")}
                onChange={handleHandledByChange}
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
            </FormControl>
          ) : null}
        </Row>
      ) : null}
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
            setStatus(["Active", "Upcoming"])
            setSearchVariables({
              search: "",
              hidden: true,
              handledBy: null,
              status: ["Active", "Upcoming"],
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
