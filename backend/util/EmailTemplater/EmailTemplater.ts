import { render } from "micromustache"
import * as Templates from "./templates"

import { EmailTemplate, User } from "/generated/prisma-client"
import { KeyWordToTemplateType } from "./types/KeywordToTemplateType"
import Template from "./types/Template"
import ITemplateConstructor from "./types/ITemplateConstructor"

export class EmailTemplater {
  keyWordToTemplate: KeyWordToTemplateType = {
    completion_link: Templates.CompletionLink,
    grade: Templates.Grade,
  }
  emailTemplate: EmailTemplate
  user: User

  constructor(emailTemplate: EmailTemplate, user: User) {
    this.emailTemplate = emailTemplate
    this.user = user
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
