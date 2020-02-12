import { render } from "micromustache"
import * as Templates from "./templates"

import { EmailTemplate, User } from "/generated/prisma-client"
import { KeyWordToTemplateType } from "./types/KeywordToTemplateType"
import Template from "./types/Template"

export class EmailTemplater {
  keyWordToTemplate: KeyWordToTemplateType = {
    completion_link: typeof Templates.CompletionLink,
  }
  emailTemplate: EmailTemplate
  user: User

  constructor(emailTemplate: EmailTemplate, user: User) {
    this.emailTemplate = emailTemplate
    this.user = user
  }

  async resolve(): Promise<string> {
    const template = this.emailTemplate.txt_body ?? ""
    Object.getOwnPropertyNames(this.keyWordToTemplate).forEach(p => {
      this.keyWordToTemplate[p] = (<Template>(
        this.keyWordToTemplate[p]
      )).resolve()
    })
    return render(template, this.keyWordToTemplate)
  }
}
