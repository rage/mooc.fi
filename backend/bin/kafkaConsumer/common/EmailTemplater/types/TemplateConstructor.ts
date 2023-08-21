import Template from "./Template"
import { TemplateParams } from "./TemplateParams"

export default interface TemplateConstructor {
  new (params: TemplateParams): Template
}
