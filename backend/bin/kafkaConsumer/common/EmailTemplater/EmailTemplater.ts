import { render, tokenize } from "micromustache"

import { EmailTemplate, Organization, User } from "@prisma/client"

import * as Templates from "./templates"
import {
  KeywordToTemplate,
  KeywordToTemplateConstructor,
  KeywordToTemplateType,
} from "./types/KeywordToTemplate"
import { TemplateContext } from "./types/TemplateContext"
import { TemplateParams } from "./types/TemplateParams"
import { EmailTemplaterError } from "/lib/errors"

const templates: KeywordToTemplateConstructor = {
  completion_link: Templates.CompletionLink,
  grade: Templates.Grade,
  started_course_count: Templates.StartedCourseCount,
  completed_course_count: Templates.CompletedCourseCount,
  at_least_one_exercise_count: Templates.AtLeastOneExerciseCount,
  at_least_one_exercise_but_not_completed_emails:
    Templates.AtLeastOneExerciseButNotCompletedEmails,
  current_date: Templates.CurrentDate,
  organization_activation_link: Templates.OrganizationActivationLink,
  organization_activation_code: Templates.OrganizationActivationCode,
  organization_activation_code_expiry_date:
    Templates.OrganizationActivationCodeExpiryDate,
  organization_name: Templates.OrganizationName,
  user_full_name: Templates.UserFullName,
  user_first_name: Templates.UserFirstName,
  user_last_name: Templates.UserLastName,
}

export class EmailTemplater {
  keywordToTemplateType: KeywordToTemplateType
  emailTemplate: EmailTemplate
  user: User
  email?: string
  organization?: Organization
  context: TemplateContext
  field: keyof Pick<EmailTemplate, "txt_body" | "title" | "html_body">

  constructor({
    emailTemplate,
    user,
    organization,
    email,
    context,
    field = "txt_body",
  }: TemplateParams) {
    this.emailTemplate = emailTemplate
    this.user = user
    this.email = email
    this.organization = organization
    this.context = context
    this.field = field
    this.keywordToTemplateType = {}

    this.prepare()
  }

  async resolve(): Promise<string> {
    const template = this.emailTemplate[this.field] ?? ""
    const resolvedTemplates = await this.resolveTemplates()
    return render(template, resolvedTemplates)
  }

  private prepare() {
    const usedTemplates = tokenize(
      this.emailTemplate[this.field] ?? "",
    ).varNames
    const unknownTemplateNames = usedTemplates.filter((p) => !templates[p])
    if (unknownTemplateNames.length > 0) {
      throw new EmailTemplaterError(
        `Unknown template name(s): ${unknownTemplateNames.join(", ")}`,
      )
    }
    usedTemplates.forEach((p) => {
      this.keywordToTemplateType[p] = new templates[p]({
        emailTemplate: this.emailTemplate,
        user: this.user,
        organization: this.organization,
        email: this.email,
        context: this.context,
      })
    })
  }

  private async resolveTemplates(): Promise<KeywordToTemplate> {
    const resolvedTemplates: KeywordToTemplate = {}
    for (const p of Object.getOwnPropertyNames(this.keywordToTemplateType)) {
      resolvedTemplates[p] = await this.keywordToTemplateType[p].resolve()
    }
    return resolvedTemplates
  }
}
