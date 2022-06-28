import { EmailTemplate, PrismaClient, User } from "@prisma/client"
import { render } from "micromustache"

import * as Templates from "./templates"
import ITemplateConstructor from "./types/ITemplateConstructor"
import { KeyWordToTemplateType } from "./types/KeywordToTemplateType"
import Template from "./types/Template"

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
  }
  emailTemplate: EmailTemplate
  user: User
  prisma: PrismaClient

  constructor(emailTemplate: EmailTemplate, user: User, prisma: PrismaClient) {
    this.emailTemplate = emailTemplate
    this.user = user
    this.prisma = prisma
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
        prisma: this.prisma,
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
