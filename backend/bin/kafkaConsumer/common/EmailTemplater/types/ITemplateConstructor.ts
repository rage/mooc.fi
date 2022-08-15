import ITemplate from "./ITemplate"
import { TemplateParams } from "./TemplateParams"

export default interface ITemplateConstructor {
  new (params: TemplateParams): ITemplate
}
