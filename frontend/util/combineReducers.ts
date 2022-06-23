import { Reducer } from "react"

export default function combineReducers<
  State,
  ActionMap extends { [Key in keyof State]: ActionMap[Key] },
>(reducers: {
  [K in keyof State]: Reducer<State[K], ActionMap[K]>
}): Reducer<State, ActionMap[keyof State]> {
  return (state, action) => {
    return (Object.keys(reducers) as Array<keyof State>).reduce(
      (prevState, key) => ({
        ...prevState,
        [key]: reducers[key](prevState[key], action),
      }),
      state,
    )
  }
}
