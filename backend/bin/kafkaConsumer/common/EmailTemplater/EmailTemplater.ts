import { render } from "micromustache"

import { EmailTemplate, Organization, User } from "@prisma/client"

import * as Templates from "./templates"
import ITemplateConstructor from "./types/ITemplateConstructor"
import { KeyWordToTemplateType } from "./types/KeywordToTemplateType"
import Template from "./types/Template"
import { TemplateContext } from "./types/TemplateContext"
import { TemplateParams } from "./types/TemplateParams"

export class EmailTemplater {
  keyWordToTemplate: KeyWordToTemplateType = {
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
    organization_name: Templates.OrganizationName,
    user_full_name: Templates.UserFullName,
    user_first_name: Templates.UserFirstName,
    user_last_name: Templates.UserLastName,
  }
  emailTemplate: EmailTemplate
  user: User
  email?: string
  organization?: Organization
  context: TemplateContext

  constructor({
    emailTemplate,
    user,
    organization,
    email,
    context,
  }: TemplateParams) {
    this.emailTemplate = emailTemplate
    this.user = user
    this.email = email
    this.organization = organization
    this.context = context

    this.prepare()
  }

  async resolve(): Promise<string> {
    const template = this.emailTemplate.txt_body ?? ""
    await this.resolveAllTemplates()
    return render(template, this.keyWordToTemplate)
  }

  private prepare() {
    Object.getOwnPropertyNames(this.keyWordToTemplate).forEach((p) => {
      this.keyWordToTemplate[p] = new (this.keyWordToTemplate[
        p
      ] as ITemplateConstructor)({
        emailTemplate: this.emailTemplate,
        user: this.user,
        organization: this.organization,
        email: this.email,
        context: this.context,
      }) as Template
    })
  }

  private async resolveAllTemplates(): Promise<void> {
    await this.asyncForEach(
      Object.getOwnPropertyNames(this.keyWordToTemplate),
      async (p: string) => {
        this.keyWordToTemplate[p] = (await (
          this.keyWordToTemplate[p] as Template
        ).resolve()) as string
      },
    )
  }

  async asyncForEach(
    array: (keyof KeyWordToTemplateType)[],
    callback: Function,
  ) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
}
