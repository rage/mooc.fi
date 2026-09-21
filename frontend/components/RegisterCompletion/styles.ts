import { Button, EnhancedButton } from "@mui/material"
import { styled } from "@mui/material/styles"

export const Section = styled("div")`
  padding: 1.75rem 2.25rem;

  @media (max-width: 40rem) {
    padding: 1.5rem 1.25rem;
  }
`

export const DividedSection = styled(Section)`
  border-top: 1px solid #ebedee;
`

export const InstructionsSection = styled(DividedSection)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const QuestionSection = styled(DividedSection)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const Prose = styled("p")`
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: #313947;
`

export const QuestionText = styled("p")`
  margin: 0;
  font-family: var(--header-font);
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.005em;
  color: #1a2333;
`

export const QuestionHint = styled("p")`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #535a66;
`

export const AnswerButtons = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
`

// The two themes disagree on what makes a button outlined: newTheme keys off the color prop
// (secondary is its outlined treatment), the legacy theme behind /_old keys off the variant.
// Both props are set so the unselected answer reads as outlined either way.
export const AnswerButton = styled(Button)`
  min-width: 7rem;
  /* Sentence-long answers wrap on narrow screens; the theme line-height is too tight for that. */
  line-height: 1.3;
`

export const CallToActionButton = styled(Button)`
  align-self: flex-start;
  height: auto;
  min-height: 48px;
  padding: 0.75rem 1.5rem;
  line-height: 1.3;
  text-align: left;
` as EnhancedButton
