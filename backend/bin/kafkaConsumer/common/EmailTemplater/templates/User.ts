import { EmailTemplaterError } from "../../../../../lib/errors"
import Template from "../types/Template"
import { TemplateParams } from "../types/TemplateParams"

abstract class UserTemplate extends Template {
  constructor(params: TemplateParams) {
    super(params)

    if (!params.user) {
      throw new EmailTemplaterError(
        "no user - are you sure you're using the right template?",
      )
    }
  }
}
export class UserFullName extends UserTemplate {
  async resolve() {
    return [this.user.first_name, this.user.last_name].filter(Boolean).join(" ")
  }
}

export class UserFirstName extends Template {
  async resolve() {
    return this.user.first_name ?? ""
  }
}

export class UserLastName extends Template {
  async resolve() {
    return this.user.last_name ?? ""
  }
}
