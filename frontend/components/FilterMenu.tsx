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

interface ScalingFormControlProps {
  sizes: Array<[string, number] | [string, number, number]>
}

interface SearchVariables {
  search?: string
  hidden?: boolean | null
  handledBy?: string | null
  status?: string[] | null
}

interface FilterProps {
  searchVariables: SearchVariables
  setSearchVariables: React.Dispatch<SearchVariables>
  initialSearchString?: string
  initialHidden?: boolean | null
  initialHandledBy?: string | null
  initialStatus?: string[] | null
  handlerCourses: HandlerCourses_handlerCourses[]
  loading: boolean
}

export default function FilterMenu({
  searchVariables,
  setSearchVariables,
  initialSearchString = "",
  initialHidden,
  initialHandledBy,
  initialStatus,
  loading,
  handlerCourses,
}: FilterProps) {
  const [searchString, setSearchString] = useState<string>(initialSearchString)
  const [hideHidden, setHideHidden] = useState(initialHidden ?? true)
  const [handledBy, setHandledBy] = useState(initialHandledBy ?? "")
  const [status, setStatus] = useState<string[]>(initialStatus ?? [])

  const inputLabel = useRef<any>(null)
  const [labelWidth, setLabelWidth] = useState(0)

  useEffect(() => setLabelWidth(inputLabel?.current?.offsetWidth ?? 0), [])

  const onSubmit = () => {
    setSearchVariables({
      ...searchVariables,
      search: searchString,
      hidden: !hideHidden,
      handledBy,
    })
  }

  const handleStatusChange = (
    e: React.ChangeEvent<{ name?: string; value: any }>,
  ) => {
    const newStatus = e.target.value as string[]
    setStatus(newStatus)
    setSearchVariables({
      ...searchVariables,
      status: newStatus,
    })
  }

  const handleStatusDelete = (value: string) => () => {
    const newStatus = status?.filter((s) => s !== value)

    setStatus(newStatus)
    setSearchVariables({
      ...searchVariables,
      status: newStatus,
    })
  }

  const handleHiddenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHideHidden(e.target.checked)
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
        <FormControl disabled={loading}>
          <FormControlLabel
            label="Hide hidden"
            control={
              <Checkbox
                id="hidden"
                checked={hideHidden}
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
          <Select
            multiple
            value={status}
            onChange={handleStatusChange}
            input={<Input />}
            renderValue={(selected: any) => (
              <>
                {selected.map((value: string) => (
                  <Chip
                    key={value}
                    label={value}
                    clickable
                    size="small"
                    onDelete={handleStatusDelete(value)}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                ))}
              </>
            )}
          >
            {["Active", "Upcoming", "Ended"].map((value) => (
              <MenuItem key={`item-${value}`} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl disabled={loading} style={{ gridColumn: "span 3" }}>
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
            setHideHidden(true)
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
