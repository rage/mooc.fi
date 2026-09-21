import { styled } from "@mui/material/styles"

import { AnswerButton, AnswerButtons, QuestionHint } from "./styles"

const StackedAnswers = styled(AnswerButtons)`
  flex-direction: column;
  align-items: stretch;
`

const AnswerRow = styled("div")`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`

const AnswerHint = styled(QuestionHint)`
  flex: 1 1 18rem;
  min-width: 0;
  overflow-wrap: anywhere;
`

export interface AnswerOption<Value extends string> {
  value: Value
  label: string
  /** Rendered as HTML so a translation can put a link here. */
  hint?: string
}

interface AnswerButtonGroupProps<Value extends string> {
  options: ReadonlyArray<AnswerOption<Value>>
  value: Value | null
  onChange: (value: Value) => void
}

/**
 * Answer control for the register-completion questions: every option stays visible and the chosen
 * one reads as pressed, so a student can go back and change an answer.
 *
 * Options carrying a hint get a row each; short options sit side by side.
 */
function AnswerButtonGroup<Value extends string>({
  options,
  value,
  onChange,
}: AnswerButtonGroupProps<Value>) {
  const Container = options.some((option) => option.hint)
    ? StackedAnswers
    : AnswerButtons

  return (
    <Container>
      {options.map((option) => {
        const selected = value === option.value

        return (
          <AnswerRow key={option.value}>
            <AnswerButton
              variant={selected ? "contained" : "outlined"}
              color={selected ? "primary" : "secondary"}
              aria-pressed={selected}
              // Re-clicking the current answer stays silent: callers reset the answers below on
              // every change, so a stray onChange would wipe them.
              onClick={() => !selected && onChange(option.value)}
            >
              {option.label}
            </AnswerButton>
            {option.hint && (
              <AnswerHint dangerouslySetInnerHTML={{ __html: option.hint }} />
            )}
          </AnswerRow>
        )
      })}
    </Container>
  )
}

export default AnswerButtonGroup
