import {
  Checkbox,
  InputLabel,
  OutlinedInput,
  MenuItem,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Select,
  TextField,
} from "@material-ui/core"
import { useEffect, useRef, useState } from "react"
import { Clear } from "@material-ui/icons"

import styled from "styled-components"
import { HandlerCourses_handlerCourses } from "/static/types/generated/HandlerCourses"

const Container = styled.div`
  background-color: white;
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  space-between: 0.5rem;
`
interface SearchVariables {
  search?: string
  hidden?: boolean | null
  handledBy?: string | null
}

interface FilterProps {
  searchVariables: SearchVariables
  setSearchVariables: React.Dispatch<SearchVariables>
  initialSearchString?: string
  initialHidden?: boolean | null
  initialHandledBy?: string | null
  handlerCourses: HandlerCourses_handlerCourses[]
  loading: boolean
}

export default function FilterMenu({
  searchVariables,
  setSearchVariables,
  initialSearchString = "",
  initialHidden,
  initialHandledBy,
  loading,
  handlerCourses,
}: FilterProps) {
  const [searchString, setSearchString] = useState<string>(initialSearchString)
  const [hidden, setHidden] = useState(initialHidden ?? false)
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
  return (
    <Container>
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
      />
      <FormControl disabled={loading} style={{ marginLeft: "0.5rem" }}>
        <FormControlLabel
          label="Show hidden"
          control={
            <Checkbox
              id="hidden"
              checked={hidden}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setHidden(e.target.checked)
                setSearchVariables({
                  ...searchVariables,
                  hidden: e.target.checked || null,
                })
              }}
            />
          }
        />
      </FormControl>
      <FormControl
        disabled={loading}
        style={{ marginLeft: "0.5rem", width: "50%" }}
      >
        <InputLabel id="handledBy" shrink={Boolean(handledBy)} ref={inputLabel}>
          Handled by
        </InputLabel>
        <Select
          value={loading ? "" : handledBy}
          variant="outlined"
          onChange={(e: React.ChangeEvent<{ name?: string; value: any }>) => {
            setHandledBy(e.target.value)
            setSearchVariables({
              ...searchVariables,
              handledBy: e.target.value,
            })
          }}
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
    </Container>
  )
}
