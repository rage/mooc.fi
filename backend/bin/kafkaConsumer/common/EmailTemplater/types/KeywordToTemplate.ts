import Template from "./Template"
import TemplateConstructor from "./TemplateConstructor"

export type KeywordToTemplateType = {
  [key: string]: Template
}

export type KeywordToTemplateConstructor = {
  [key: string]: TemplateConstructor
}

export type KeywordToTemplate = {
  [key: string]: string
}
