export type EmailTemplateType =
  | "completion"
  | "course-stats"
  | "threshold"
  | "join-organization"

export const emailTemplateNames: Record<EmailTemplateType, string> = {
  "course-stats": "Course stats",
  completion: "Completion",
  threshold: "Threshold",
  "join-organization": "Join organization",
}

export interface EmailTemplateDescription {
  name: string
  description?: string
  types?: Array<EmailTemplateType>
}

export const emailTemplateDescriptions: Array<EmailTemplateDescription> = [
  {
    name: "grade",
    description: "Course grade",
    types: ["completion", "threshold"],
  },
  {
    name: "completion_link",
    description: "Link to register the completion for the course",
    types: ["completion", "threshold"],
  },
  {
    name: "started_course_count",
    description:
      "Number of distinct students that have started this course, ie. have settings attached to them - not necessarily completed any exercises",
    types: ["course-stats"],
  },
  {
    name: "completed_course_count",
    description: "Number of distinct students that have completed this course",
    types: ["course-stats"],
  },
  {
    name: "at_least_one_exercise_count",
    description:
      "Number of distinct students that have completed at least one exercise in this course",
    types: ["course-stats"],
  },
  {
    name: "at_least_one_exercise_but_not_completed_emails",
    description:
      "Email addresses of students that have completed at least one exercise in this course, but not completed the course. Requires ownership of the course to use.",
    types: ["course-stats"],
  },
  {
    name: "current_date",
    description: "Current date",
  },
  {
    name: "organization_activation_link",
    description:
      "Activation link to confirm joining organization, if organization is set up to require email confirmation",
    types: ["join-organization"],
  },
  {
    name: "organization_name",
    description: "Name of the organization",
    types: ["join-organization"],
  },
  {
    name: "user_first_name",
    description: "First name of the user the email is sent to",
  },
  {
    name: "user_last_name",
    description: "Last name of the user the email is sent to",
  },
  {
    name: "user_full_name",
    description:
      "Full name of the user the email is sent to, ie. first name and last name concatenated",
  },
]
