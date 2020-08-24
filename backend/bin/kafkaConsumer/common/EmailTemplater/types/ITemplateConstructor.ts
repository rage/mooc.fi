import { TemplateParams } from "./TemplateParams"
import ITemplate from "./ITemplate"

export default interface ITemplateConstructor {
  new (params: TemplateParams): ITemplate
}
