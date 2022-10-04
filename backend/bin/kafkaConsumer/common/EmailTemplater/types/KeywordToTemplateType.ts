import ITemplateConstructor from "./ITemplateConstructor"
import Template from "./Template"

export type KeyWordToTemplateType = {
  [key: string]: string | Template | ITemplateConstructor
}
