import { createContext, Dispatch, SetStateAction, useContext } from "react"
import { FormStatus } from "/components/Dashboard/Editor2/types"
import { SubmitErrorHandler, SubmitHandler } from "react-hook-form"

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
  tab: number
  setTab: Dispatch<SetStateAction<number>>
  /*history: FormHistory<T>
  undo: () => void
  redo: () => void
  push: (state: FormHistoryState<T>) => void*/
  onSubmit: SubmitHandler<T>
  onError: SubmitErrorHandler<Record<string, any>>
  onCancel: () => void
  onDelete: (id: string) => void
  initialValues: T
}

export const EditorContext = createContext<EditorContext<any>>({
  status: { message: null },
  setStatus: (_: any) => {},
  tab: 0,
  setTab: (_: any) => {},
  /*history: { states: [], index: -1 } as FormHistory<T>,
  undo: () => { },
  redo: () => { },
  push: () => { },*/
  onSubmit: () => {},
  onError: () => {},
  onCancel: () => {},
  onDelete: () => {},
  initialValues: {},
})

/*export const createEditorContext = once(<T,>() => createContext<EditorContext<T>>({
    status: { message: null },
    setStatus: (_: any) => { },
    history: { states: [], index: -1 } as FormHistory<T>,
    undo: () => { },
    redo: () => { },
    push: () => { },
    onSubmit: () => {},
    onError: () => {},
    onCancel: () => {},
    onDelete: () => {}
  }))*/

export function useEditorContext<T>() {
  return useContext<EditorContext<T>>(EditorContext)
}

enum HistoryActionType {
  Undo = "Undo",
  Redo = "Redo",
  AppendState = "AppendState",
  SetIndex = "SetIndex",
  SetState = "SetState",
}

type HistoryAction<T> =
  | {
      type: HistoryActionType.Undo | HistoryActionType.Redo
    }
  | {
      type: HistoryActionType.AppendState
      payload: FormHistoryState<T>
    }
  | {
      type: HistoryActionType.SetIndex
      payload: number
    }
  | {
      type: HistoryActionType.SetState
      payload: FormHistory<T>
    }

let lastAction: HistoryAction<any>

// @ts-ignore: disabled for now
function historyReducer<T extends Record<string, any> = Record<string, any>>(
  state: FormHistory<T>,
  action: HistoryAction<T>,
): FormHistory<T> {
  // React calls reducers twice just to be sure
  if (lastAction === action) {
    return state
  }
  lastAction = action

  if (action.type === HistoryActionType.Undo) {
    if (state.index >= 0) {
      return {
        ...state,
        index: state.index - 1,
      }
    }
  }
  if (action.type === HistoryActionType.Redo) {
    if (state.index < state.states.length) {
      return {
        ...state,
        index: state.index + 1,
      }
    }
  }
  if (action.type === HistoryActionType.AppendState) {
    const prevState = state.states[state.index]
    if (JSON.stringify(prevState) === JSON.stringify(action.payload)) {
      return state
    }

    // can't redo after adding new state, so chop off after current index
    return {
      states: state.states.slice(0, state.index + 1).concat(action.payload),
      index: state.index + 1,
    }
  }

  return state
}

/*export function EditorContextProvider<T extends Record<string, any>>({ children }: PropsWithChildren<{}>) {
  const EditorContext = createEditorContext<T>()
  const initialState: FormHistory<T> = {
    states: [] as Array<FormHistoryState<T>>,
    index: -1
  }
  const [status, setStatus] = useState<FormStatus>({ message: null })
  const [history, dispatch] = useReducer(historyReducer, initialState)
  const undo = () => dispatch({ type: HistoryActionType.Undo })
  const redo = () => dispatch({ type: HistoryActionType.Redo })
  const push = (state: FormHistoryState<T>) => dispatch({ type: HistoryActionType.AppendState, payload: state })


  return (
    <EditorContext.Provider
      value={{
        status,
        setStatus,
        undo,
        redo,
        push, //: push as <T>(state: FormHistoryState<T>) => void,
        history: history as FormHistory<T>
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}*/
