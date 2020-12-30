import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useReducer, useState } from "react"
import { FormStatus } from "/components/Dashboard/Editor2/types"
import { once } from "lodash"

export interface FormHistoryState<T extends Record<string, any>> {
  values: T
  tab: number
}

export interface FormHistory<T extends Record<string, any>> {
  states: Array<FormHistoryState<T>>
  index: number
}
export interface EditorContext<T extends Record<string, any>> {
  status: FormStatus
  setStatus: Dispatch<SetStateAction<FormStatus>>
  history: FormHistory<T>
  undo: () => void
  redo: () => void
  push: (state: FormHistoryState<T>) => void
}

/*export const EditorContext = createContext<EditorContext<T>>({
  status: { message: null },
  setStatus: (_: any) => { },
  history: { states: [], index: 0 },
  undo: () => { },
  redo: () => { },
  push: () => { }
})*/
export const createEditorContext = once(<T,>() => createContext<EditorContext<T>>({
    status: { message: null },
    setStatus: (_: any) => { },
    history: { states: [], index: -1 } as FormHistory<T>,
    undo: () => { },
    redo: () => { },
    push: () => { }
  }))

export function useEditorContext<T>() {
  const EditorContext = createEditorContext<T>()

  return useContext(EditorContext)
}

enum HistoryActionType {
  Undo = "Undo",
  Redo = "Redo",
  AppendState = "AppendState",
  SetIndex = "SetIndex",
  SetState = "SetState"
}

type HistoryAction<T> = {
  type: HistoryActionType.Undo | HistoryActionType.Redo,
} | {
  type: HistoryActionType.AppendState,
  payload: FormHistoryState<T>
} | {
  type: HistoryActionType.SetIndex,
  payload: number
} | {
  type: HistoryActionType.SetState,
  payload: FormHistory<T>
}

let lastAction: HistoryAction<any>

function historyReducer<T extends Record<string, any> = Record<string, any>>(state: FormHistory<T>, action: HistoryAction<T>): FormHistory<T> {
  // React calls reducers twice just to be sure
  if (lastAction === action) {
    return state
  }
  lastAction = action

  console.log("what the f", state, action)
  if (action.type === HistoryActionType.Undo) {
    if (state.index >= 0) {
      return {
        ...state,
        index: state.index - 1
      }
    }
  }
  if (action.type === HistoryActionType.Redo) {
    if (state.index < state.states.length) {
      return {
        ...state,
        index: state.index + 1
      }
    }
  }
  if (action.type === HistoryActionType.AppendState) {
    const prevState = state.states[state.index]
    if (JSON.stringify(prevState) === JSON.stringify(action.payload)) {
      return state
    }

    const newState = {
      states: state.states.slice(0, state.index + 1).concat(action.payload),
      index: state.index + 1
    }
    console.log("new state", newState)
    return newState
  }

  return state
}

export function EditorContextProvider<T extends Record<string, any>>({ children }: PropsWithChildren<{}>) {
  const EditorContext = createEditorContext<T>()
  const initialState: FormHistory<T> = {
    states: [] as Array<FormHistoryState<T>>,
    index: -1
  }
  const [status, setStatus] = useState<FormStatus>({ message: null })
  const [history, dispatch] = useReducer(historyReducer, initialState)
  const undo = () => dispatch({ type: HistoryActionType.Undo })
  const redo = () => dispatch({ type: HistoryActionType.Redo })
  const push = (state: FormHistoryState<T>) =>
    (console.log("run"), dispatch({ type: HistoryActionType.AppendState, payload: state }))


  return (
    <EditorContext.Provider
      value={{
        status,
        setStatus,
        undo,
        redo,
        push, //: push as <T>(state: FormHistoryState<T>) => void,
        history, //: history as FormHistory<T>
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}