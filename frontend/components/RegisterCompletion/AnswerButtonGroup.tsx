import { AnswerButton, AnswerButtons } from "./styles"

export interface AnswerOption<Value extends string> {
  value: Value
  label: string
}

interface AnswerButtonGroupProps<Value extends string> {
  options: ReadonlyArray<AnswerOption<Value>>
  value: Value | null
  onChange: (value: Value) => void
  /**
   * Id of the heading that labels this question. Buttons have no built-in way to expose "this
   * group answers that question" the way a radio group's fieldset/legend would, so pass it to get
   * `role="group"` + `aria-labelledby` wired up.
   */
  ariaLabelledBy?: string
}

/**
 * Answer control for the register-completion questions: every option stays visible and the chosen
 * one reads as pressed, so a student can go back and change an answer.
 */
function AnswerButtonGroup<Value extends string>({
  options,
  value,
  onChange,
  ariaLabelledBy,
}: AnswerButtonGroupProps<Value>) {
  return (
    <AnswerButtons
      role={ariaLabelledBy ? "group" : undefined}
      aria-labelledby={ariaLabelledBy}
    >
      {options.map((option) => {
        const selected = value === option.value

        return (
          <AnswerButton
            key={option.value}
            variant={selected ? "contained" : "outlined"}
            color={selected ? "primary" : "secondary"}
            aria-pressed={selected}
            // Re-clicking the current answer stays silent: callers reset the answers below on
            // every change, so a stray onChange would wipe them.
            onClick={() => !selected && onChange(option.value)}
          >
            {option.label}
          </AnswerButton>
        )
      })}
    </AnswerButtons>
  )
}

export default AnswerButtonGroup
