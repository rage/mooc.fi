import Template from "../types/Template"

export class UserFullName extends Template {
  async resolve() {
    if (!this.user) {
      throw new Error("no user - are you sure you're using the right template?")
    }

    return [this.user.first_name, this.user.last_name].filter(Boolean).join(" ")
  }
}

export class UserFirstName extends Template {
  async resolve() {
    if (!this.user) {
      throw new Error("no user - are you sure you're using the right template?")
    }

    return this.user.first_name ?? ""
  }
}

export class UserLastName extends Template {
  async resolve() {
    if (!this.user) {
      throw new Error("no user - are you sure you're using the right template?")
    }

    return this.user.last_name ?? ""
  }
}
