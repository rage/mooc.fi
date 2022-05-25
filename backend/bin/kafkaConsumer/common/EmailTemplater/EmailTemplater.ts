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
    current_date: Templates.CurrentDate,
    organization_activation_link: Templates.OrganizationActivationLink,
    organization_name: Templates.OrganizationName,
    user_full_name: Templates.UserFullName,
    user_first_name: Templates.UserFirstName,
    user_last_name: Templates.UserLastName,
  }
  emailTemplate: EmailTemplate
  user: User
  organization?: Organization
  context: TemplateContext

  constructor({ emailTemplate, user, organization, context }: TemplateParams) {
    this.emailTemplate = emailTemplate
    this.user = user
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
      this.keyWordToTemplate[p] = <Template>(
        new (<ITemplateConstructor>this.keyWordToTemplate[p])({
          emailTemplate: this.emailTemplate,
          user: this.user,
          organization: this.organization,
          context: this.context,
        })
      )
    })
  }

  private async resolveAllTemplates(): Promise<void> {
    await this.asyncForEach(
      Object.getOwnPropertyNames(this.keyWordToTemplate),
      async (p: string) => {
        this.keyWordToTemplate[p] = <string>(
          await (<Template>this.keyWordToTemplate[p]).resolve()
        )
      },
    )
  }

  async asyncForEach(array: any[], callback: Function) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
}
