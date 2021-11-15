import Template from "../types/Template"

export class CurrentDate extends Template {
  async resolve() {
    return new Date().toISOString().split("T")[0]
  }
}
