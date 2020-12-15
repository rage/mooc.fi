import {
  Checkbox,
  Chip,
  InputLabel,
  OutlinedInput,
  MenuItem,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Select,
  TextField,
  Button,
  Input,
} from "@material-ui/core"
import { useEffect, useRef, useState } from "react"
import { Clear, Search } from "@material-ui/icons"

import styled from "styled-components"
import { HandlerCourses_handlerCourses } from "/static/types/generated/HandlerCourses"

const Container = styled.div`
  background-color: white;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
`

const Row = styled.section`
  display: grid;
  grid-gap: 0.5rem;
  margin: 0.5rem;
  @media (max-width: 432px) {
    grid-template-columns: repeat(1, 1fr);
  }
  @media (min-width: 432px; max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 600px, max-width: 800px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 800px) {
    grid-template-columns: repeat(6, 1fr);
  }
`

interface SearchVariables {
  search?: string
  hidden?: boolean | null
  handledBy?: string | null
  status?: string[] | null
}

interface FilterProps {
  searchVariables: SearchVariables
  setSearchVariables: React.Dispatch<SearchVariables>
  handlerCourses: HandlerCourses_handlerCourses[]
  status: string[]
  setStatus: React.Dispatch<React.SetStateAction<string[]>>
  loading: boolean
}

export default function FilterMenu({
  searchVariables,
  setSearchVariables,
  loading,
  handlerCourses,
  status,
  setStatus,
}: FilterProps) {
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

  const inputLabel = useRef<any>(null)
  const [labelWidth, setLabelWidth] = useState(0)

  useEffect(() => setLabelWidth(inputLabel?.current?.offsetWidth ?? 0), [])

  const onSubmit = () => {
    setSearchVariables({
      ...searchVariables,
      search: searchString,
      hidden,
      handledBy,
    })
  }

  const handleStatusChange = (value: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
      hidden: !e.target.checked,
    })
  }

  const handleHandledByChange = (
    e: React.ChangeEvent<{ name?: string; value: any }>,
  ) => {
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
          label="Search"
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
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          style={{ gridColumn: "span 8" }}
        />
      </Row>
      <Row>
        <FormControl disabled={loading} style={{ gridColumn: "span 2" }}>
          <FormControlLabel
            label="Show hidden"
            control={
              <Checkbox
                id="hidden"
                checked={hidden}
                onChange={handleHiddenChange}
              />
            }
          />
        </FormControl>
        <FormControl
          disabled={loading}
          style={{
            gridColumn: "span 2",
          }}
        >
          <div style={{ display: "flex" }}>
            {["Active", "Upcoming", "Ended"].map((value) => (
              <FormControlLabel
                label={value}
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
        <FormControl disabled={loading} style={{ gridColumn: "span 2" }}>
          <InputLabel
            id="handledBy"
            shrink={Boolean(handledBy)}
            ref={inputLabel}
          >
            Handled by
          </InputLabel>
          <Select
            value={loading ? "" : handledBy}
            variant="outlined"
            onChange={handleHandledByChange}
            input={
              <OutlinedInput
                notched={Boolean(handledBy)}
                labelWidth={labelWidth}
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
      </Row>
      <Row style={{ display: "flex", flexDirection: "row-reverse" }}>
        <Button
          disabled={loading}
          onClick={onSubmit}
          color="primary"
          variant="contained"
          style={{ marginLeft: "0.5rem" }}
          startIcon={<Search />}
        >
          Search
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
          Reset
        </Button>
      </Row>
    </Container>
  )
}
