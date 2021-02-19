import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { useReducer } from "react";
import ExerciseEntry from "/components/Dashboard/Users/Points/ExerciseEntry";
import { UserPointsList_user_exercise_completions } from "/static/types/generated/UserPointsList";

interface ExerciseListProps {
  exerciseCompletions: UserPointsList_user_exercise_completions[]
}

function PartHeader({ part }: { part: number }) {
  return (
    <TableRow style={{ background: "black", color: "white" }}>
      <TableCell colSpan={6} style={{ color: "white" }}>
        Part {part}  
      </TableCell> 
    </TableRow>
  )
}

type ExerciseCompletionState = Record<string, boolean>
enum ActionType {
  OPEN,
  CLOSE,
  OPEN_ALL,
  CLOSE_ALL
}

type ExerciseCompletionCollapseAction = {
  type: ActionType
  id: string
}

const reducer = (action: ExerciseCompletionCollapseAction, state: ExerciseCompletionState) => {
  switch (action.type) {
    case ActionType.OPEN:
      return {
        ...state,
        [action.id]: true
      }
    case ActionType.CLOSE:
      return {
        ...state,
        [action.id] : false
      }
    case ActionType.OPEN_ALL:
      return Object.keys(state).reduce((acc, curr) => ({
        ...acc,
        [curr]: true
      }), state)
    case ActionType.OPEN_ALL:
      return Object.keys(state).reduce((acc, curr) => ({
        ...acc,
        [curr]: false
      }), state)
    }
  return state
}

export default function ExerciseList({
  exerciseCompletions
 }: ExerciseListProps) {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              Exercise  
            </TableCell>
            <TableCell>
              Points 
            </TableCell>
            <TableCell>
              Completed
            </TableCell>
            <TableCell>
              Required actions
            </TableCell>
            <TableCell>
              More...
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exerciseCompletions.map((exerciseCompletion, index) => 
            <ExerciseEntry
              key={`exercise-${exerciseCompletion.exercise?.id}-${index}`}
              exerciseCompletion={exerciseCompletion}
            />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}