import Template from "./Template"
import ITemplateConstructor from "./ITemplateConstructor"
export type KeyWordToTemplateType = {
  [key: string]: string | Template | ITemplateConstructor
}
